const kafka = require('../config/kafka');

const producer = kafka.producer();

const sendEmailMessage = async (message) => {
  try {
    await producer.connect();
    console.log('✅ Producer connected.');

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
  } catch (err) {
    console.error('❌ Error in producer:', err);
  } finally {
    await producer.disconnect();
  }
};

module.exports = {
  sendEmailMessage,
};
