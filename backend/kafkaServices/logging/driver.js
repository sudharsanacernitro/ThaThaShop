const handleMessage = require('./utils/pipelineMsgHandler');

const { consumer} = require('./config/kafka');


const run = async () => {
  try {

    await consumer.connect();
    await consumer.subscribe({ topic: 'Service-email', fromBeginning: false });

    console.log('🚀 Consumer connected. Waiting for messages...');

    await consumer.run({ eachMessage: handleMessage });
  } catch (err) {
    console.error('❌ Error during startup:', err.message);
  }
};

run();