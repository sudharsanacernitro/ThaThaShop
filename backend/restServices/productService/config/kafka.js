const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['kafka:9092'],
  retry: {
    retries: 5, // Set maximum retry attempts to 5
  },
});


module.exports = kafka;
