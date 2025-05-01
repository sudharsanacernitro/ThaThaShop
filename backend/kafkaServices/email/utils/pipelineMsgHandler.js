const { producer } = require('../config/kafka');
const { sendEmail } = require('./Mailsender');

module.exports = async function handleMessage({ topic, partition, message }) {
  const receivedMessage = message.value.toString();
  const processedResult = JSON.parse(receivedMessage);

   await sendEmail({
    to: processedResult.to,
    subject: processedResult.subject,
    text: processedResult.text,
  });


  console.log('✅ Sent response back to producer.');
};