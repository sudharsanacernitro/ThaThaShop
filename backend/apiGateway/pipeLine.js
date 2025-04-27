const GraphQLJSON = require('graphql-type-json');
const { PipeIn, PipeOut } = require('./kafkaConfig');

// Map to store resolvers for each request
const pendingRequests = new Map();


async function init() {
  await PipeIn.connect();
  await PipeOut.connect();
  await PipeOut.subscribe({ topic: 'Response', fromBeginning: false });

  await PipeOut.run({
    eachMessage: async ({ message }) => {
      try {
        const messageValue = message.value.toString();
        if (!messageValue.trim().startsWith('{') && !messageValue.trim().startsWith('[')) {
          return;
        }
        const responseData = JSON.parse(messageValue);
        if (responseData.correlationId) {
          const resolver = pendingRequests.get(responseData.correlationId);
          if (resolver) {
            resolver(responseData);
            pendingRequests.delete(responseData.correlationId);
          }
        }
      } catch (err) {
        console.error('Error processing Kafka message:', err);
      }
    }
  });
}
init();


// Generate a unique correlation ID
function generateCorrelationId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const root = {
  JSON: GraphQLJSON,
  getDynamicInfo: async (args) => {
    const { service, input } = args;
    const correlationId = generateCorrelationId();

    const kafkaRequest = {
      ...input,
      correlationId
    };

    const responsePromise = new Promise((resolve) => {
      pendingRequests.set(correlationId, resolve);
    });

    await PipeIn.send({
      topic: `Request-${service}`,
      messages: [{ value: JSON.stringify(kafkaRequest) }],
    });

    const kafkaResponse = await responsePromise;

    return kafkaResponse;
  }
};

module.exports = root;
