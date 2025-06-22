const producer = require('../config/kafka');


const logging = async (message) => {

  message.serviceName = "cartService";
  try {
    await producer.connect();
    console.log('✅ Producer connected.');

    await producer.send({
      topic: 'Service-logging',
      messages: [
        {
        //   key: 'email',
          value: JSON.stringify(message),
        },
      ],
    });

    console.log('📨 logging done');
  } catch (err) {
    console.error('❌ Error in producer:', err);
  } finally {
    await producer.disconnect();
  }
};

module.exports = {
  logging,
};
