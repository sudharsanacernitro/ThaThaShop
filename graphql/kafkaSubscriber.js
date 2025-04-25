const { Kafka } = require('kafkajs');

// Create a Kafka instance
const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:9092'], // Use your broker's address
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  // Connect the consumer
  await consumer.connect();

  // Subscribe to the topic
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  console.log('🚀 Consumer connected. Waiting for messages...');

  // Handle incoming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📩 Received message:`);
      console.log({
        key: message.key?.toString(),
        value: message.value.toString(),
        partition,
      });
    },
  });
};

run().catch(console.error);
