const { Kafka } = require('kafkajs');

const requestProducerkafka = new Kafka({
  clientId: 'Request-Producer',
  brokers: ['localhost:9092'], 
});

const PipeIn = requestProducerkafka.producer();




const responseConsumerkafka = new Kafka({
    clientId: 'Response-Consumer',
    brokers: ['localhost:9092'], 
  });
  
const PipeOut = responseConsumerkafka.consumer({ groupId: 'PipelineOutput' });

module.exports = {PipeIn, PipeOut};