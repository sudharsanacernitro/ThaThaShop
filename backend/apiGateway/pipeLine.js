const GraphQLJSON = require('graphql-type-json');
const { PipeIn, PipeOut } = require('./config/kafka');

// Map to store resolvers for each request
const pendingRequests = new Map();

// Generate a unique correlation ID
function generateCorrelationId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Kafka response handler
async function init() {
  await PipeIn.connect();
  await PipeOut.connect();
  console.log("Kafka pipeline connected.");

  await PipeOut.subscribe({ topic: 'Response', fromBeginning: false });

  await PipeOut.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const messageValue = message.value.toString().trim();

        if (!messageValue.startsWith('{') && !messageValue.startsWith('[')) {
          console.error("❌ JSON parse skipped:", messageValue);
          return;
        }

        const responseData = JSON.parse(messageValue);
        console.log("✅ Kafka response received:", responseData);

        const { correlationId } = responseData;
        if (correlationId && pendingRequests.has(correlationId)) {
          const resolver = pendingRequests.get(correlationId);
          resolver(responseData); // Resolve promise
          pendingRequests.delete(correlationId); // Cleanup
        } else {
          console.warn("⚠️ Unknown or missing correlationId:", correlationId);
        }

      } catch (err) {
        console.error('❌ Error processing Kafka message:', err);
      }
    }
  });
}

init();

const root = {
  JSON: GraphQLJSON,

  getDynamicInfo: async ({ service, subService, input }) => {
    const correlationId = generateCorrelationId();

    const kafkaRequest = {
      subService,
      ...input,
      correlationId
    };

    console.log(`📤 Sending request to Request-${service}`, kafkaRequest);

    // Create a promise that will resolve when the response is received
    const responsePromise = new Promise((resolve) => {
      pendingRequests.set(correlationId, resolve);
    });

    // Send request to Kafka
    await PipeIn.send({
      topic: `Request-${service}`,
      messages: [{ value: JSON.stringify(kafkaRequest) }],
    });

    // Wait for the response from Kafka consumer
    const kafkaResponse = await responsePromise;

    console.log("📥 Kafka response delivered to resolver:", kafkaResponse);

    return kafkaResponse;
  }
};

module.exports = root;
