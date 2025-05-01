const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'email-service-producer',
  brokers: ['localhost:9092'], // Change this to your Kafka broker(s)
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('✅ Producer connected.');

  const message = {
    to: 'sudharsanr836@gmail.com',
    subject: 'Hello from Kafka',
    text: 'This message was sent via Kafka!',
  };

  await producer.send({
    topic: 'Service-email',
    messages: [
      {
        key: 'email',
        value: JSON.stringify(message),
      },
    ],
  });

  console.log('📨 Email message sent to Kafka topic.');
  await producer.disconnect();
};

run().catch(err => {
  console.error('❌ Error in producer:', err);
});
