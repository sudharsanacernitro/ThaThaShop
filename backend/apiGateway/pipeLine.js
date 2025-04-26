const { Kafka } = require('kafkajs');

const requestProducerkafka = new Kafka({
  clientId: 'Request-Producer',
  brokers: ['localhost:9092'], 
});

const requestProducer = requestProducerkafka.producer();




const responseConsumerkafka = new Kafka({
    clientId: 'Response-Consumer',
    brokers: ['localhost:9092'], 
  });
  
const responseConsumer = responseConsumerkafka.consumer({ groupId: 'PipelineOutput' });