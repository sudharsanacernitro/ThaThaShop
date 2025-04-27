const GraphQLJSON = require('graphql-type-json');
const { PipeIn, PipeOut } = require('./kafkaConfig');

// Map to store resolvers for each request, keyed by correlation ID
const pendingRequests = new Map();

// Generate a unique correlation ID
function generateCorrelationId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Establishing connection to Kafka
async function init() {

    await PipeIn.connect();
    console.log('🚀 Input PipeLine connected');
    await PipeOut.connect();
    await PipeOut.subscribe({ topic: 'Response', fromBeginning: false });
    console.log('🚀 Output PipeLine connected');

    // Start the Kafka consumer to listen for responses persistently
    await PipeOut.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageValue = message.value.toString();
          
          // Skip non-JSON messages (like "PONG" or other control messages)
          if (!messageValue.trim().startsWith('{') && !messageValue.trim().startsWith('[')) {
            console.log('Skipping non-JSON message:', messageValue);
            return;
          }
          
          const responseData = JSON.parse(messageValue);
          console.log('📩 Received response:', responseData);
          
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

const root = {
  JSON: GraphQLJSON,
  getDynamicInfo: async (args, context) => {
    const { req, res } = context;
    const { service, input } = args;
    const clientIP = req.ip;
    const customHeader = req.headers['x-custom-header'];

    const correlationId = generateCorrelationId();
    
    const dataToSend = {
      name: "Sudharsan",
      ip: clientIP,
      header: customHeader || "Header not set",
      timestamp: new Date().toISOString(),
      body: input,
      service: service,
    };

    // Create a promise that will be resolved when the Kafka response arrives
    const responsePromise = new Promise((resolve) => {
      pendingRequests.set(correlationId, resolve);
    });

    // Add correlation ID to the request
    const kafkaRequest = {
      ...input,
      correlationId
    };

    // Send message to Kafka
    const requestTopic = `Request-${service}`;
    await PipeIn.send({
      topic: requestTopic,
      messages: [{ value: JSON.stringify(kafkaRequest) }],
    });
    console.log(`📤 Sent request to topic: ${requestTopic}`, kafkaRequest);

    // Wait for the response to arrive via Kafka
    const kafkaResponse = await responsePromise;

    return {
      ...dataToSend,
      responseMessage: kafkaResponse,
    };
  }
};

module.exports = root;