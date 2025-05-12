const producer = require('../config/kafka');


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


const confirmationEmailTemplate = ({to,itemname,quantity}) => {
 
  return{
    to: to,
    subject: 'Order Confirmation',
    text: `Your order ${itemname} x ${quantity} has been confirmed.`,
    html: `Your order ${itemname} x ${quantity} has been confirmed.If its not you, please contact our service.`,}
};



const orderUpdateEmailTemplate = ({to,itemname,quantity,date,status}) => {
 
  return{
    to: to,
    subject: 'Order Update',
    text: `Your order ${itemname} x ${quantity} has an update.`,
    html: `Your order ${itemname} x ${quantity} is ${status} and about to deliver on ${date}.`,}
};


module.exports = {
  sendEmailMessage,
  confirmationEmailTemplate,
  orderUpdateEmailTemplate
};
