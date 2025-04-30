const { Kafka } = require('kafkajs');
const splitter = require('./splitter');
const { loadSecrets } = require('./utils/vaultClient');

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });
const producer = kafka.producer();

const run = async () => {
  try {
    // 🔐 Wait for Vault secrets before continuing
    await loadSecrets();

    // ✅ Secrets are now in process.env
    require('./config/db');

    await consumer.connect();
    await producer.connect();

    await consumer.subscribe({ topic: 'Request-product', fromBeginning: false });

    console.log('🚀 Consumer connected. Waiting for messages...');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const receivedMessage = message.value.toString();
        const processedResult = JSON.parse(receivedMessage);

        const result = await splitter(processedResult.subService, processedResult);
        result.correlationId = processedResult.correlationId;

        await producer.send({
          topic: 'Response',
          messages: [{ value: JSON.stringify(result) }],
        });

        console.log('✅ Sent response back to producer.');
      },
    });
  } catch (err) {
    console.error('❌ Error during startup:', err.message);
  }
};

run().catch(console.error);
