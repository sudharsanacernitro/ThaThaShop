const handleMessage = require('./utils/pipelineMsgHandler');

const { consumer, producer } = require('./config/kafka');
const { loadSecrets } = require('./utils/vaultClient');


const run = async () => {
  try {

    await loadSecrets();
    require('./config/db');
    await consumer.connect();
    await producer.connect();


    await consumer.subscribe({ topic: 'Request-auth', fromBeginning: false });

    console.log('🚀 Consumer connected. Waiting for messages...');

    await consumer.run({ eachMessage: handleMessage });
  } catch (err) {
    console.error('❌ Error during startup:', err.message);
  }
};

run();
