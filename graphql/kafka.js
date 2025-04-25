// producer.js
const { Kafka } = require('kafkajs');

// Create a Kafka instance
const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'], // Replace with your Kafka container host if needed
});

// Create a producer instance
const producer = kafka.producer();

const run = async () => {
  // Connect the producer
  await producer.connect();

  // Send a message
  await producer.send({
    topic: 'test-topic', // Create this topic manually or let Kafka auto-create it
    messages: [
      { key: 'key1', value: 'Hello Sudharsan from Kafka!' },
    ],
  });

  console.log("✅ Message sent successfully");

  // Disconnect the producer
  await producer.disconnect();
};

run().catch(console.error);
