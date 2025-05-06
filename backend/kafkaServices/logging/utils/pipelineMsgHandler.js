const { producer } = require('../config/kafka');
const createLogger = require('../config/winstonLogger');

module.exports = async function handleMessage({ topic, partition, message }) {
  const receivedMessage = message.value.toString();
  const processedResult = JSON.parse(receivedMessage);

  console.log('[logging Service] - Received message:', processedResult);

   
  const logger = createLogger(processedResult.serviceName);

  switch(processedResult.logLevel) {

    case 0:
      logger.info(processedResult.message);
      break;

    case 1:
      logger.warn(processedResult.message);
      break;

    case 2:  
      logger.error(processedResult.message);
      break;

    default:
      logger.info(processedResult.message);
      break;
  }

  console.log('Logging message processed:', processedResult.message);
};