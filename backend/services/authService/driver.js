const { Kafka } = require('kafkajs');

const splitter = require('./splitter')

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:9092'],
});
require('./config/db'); 

const consumer = kafka.consumer({ groupId: 'test-group' });
const producer = kafka.producer(); // <-- Create a producer also

const run = async () => {
  await consumer.connect();
  await producer.connect(); // <-- Connect producer too

  await consumer.subscribe({ topic: 'Request-home', fromBeginning: false });

  console.log('🚀 Consumer connected. Waiting for messages...');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const receivedMessage = message.value.toString();
      console.log(`📩 Received message: ${receivedMessage}`);

      // Process the message (your logic here)
      const processedResult = receivedMessage;

      const result=await splitter(JSON.parse(processedResult).subService, JSON.parse(processedResult));

      // Send the result back to a new topic
      await producer.send({
        topic: 'Response', // Response topic
        messages: [
          { value: processedResult },
        ],
      });

      console.log('✅ Sent response back to producer.');

    
      
    },
  });
};

run().catch(console.error);
