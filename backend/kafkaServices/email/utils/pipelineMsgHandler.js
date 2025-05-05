const { producer } = require('../config/kafka');
const { sendEmail } = require('./Mailsender');

module.exports = async function handleMessage({ topic, partition, message }) {
  const receivedMessage = message.value.toString();
  const processedResult = JSON.parse(receivedMessage);

   await sendEmail(processedResult);


  console.log('✅ Sent response back to producer.');
};