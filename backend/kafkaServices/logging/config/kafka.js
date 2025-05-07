const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'logging-service',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'logging-service-group' });

module.exports = { consumer };
