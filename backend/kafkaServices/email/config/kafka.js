const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'email-service',
  brokers: ['kafka:9092'],
  
});

const consumer = kafka.consumer({ groupId: 'services' });

module.exports = { consumer };
