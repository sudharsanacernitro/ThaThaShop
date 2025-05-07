const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'email-service',
  brokers: ['kafka:9092'],
  
});

const consumer = kafka.consumer({ groupId: 'email-service-group' });
module.exports = { consumer };
