const { Kafka } = require('kafkajs');

const kafkaInstance = new Kafka({
  clientId: 'Gateway',
  brokers: ['localhost:9092'], 
});

const PipeIn = kafkaInstance.producer();

  
const PipeOut = kafkaInstance.consumer({ groupId: 'PipelineOutput' });

module.exports = {PipeIn, PipeOut};