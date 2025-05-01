const splitter = require('./splitter');
const { producer } = require('../config/kafka');

module.exports = async function handleMessage({ topic, partition, message }) {
  const receivedMessage = message.value.toString();
  const processedResult = JSON.parse(receivedMessage);

  const result = await splitter(processedResult.subService, processedResult);
  result.correlationId = processedResult.correlationId;

  await producer.send({
    topic: 'Response',
    messages: [{ value: JSON.stringify(result) }],
  });

  console.log('✅ Sent response back to producer.');
};
