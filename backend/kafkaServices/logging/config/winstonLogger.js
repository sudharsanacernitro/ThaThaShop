const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf} = format;
const fs = require('fs');
const path = require('path');

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

function createServiceLogger(serviceName) {
  const logDir = `logs/${serviceName}`;

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return createLogger({
    level: 'info',
    format: combine(timestamp(), customFormat),
    transports: [
      new transports.File({ filename: path.join(logDir, 'info.log'), level: 'info' }),
      new transports.File({ filename: path.join(logDir, 'warn.log'), level: 'warn' }),
      new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
      new transports.Console(),
    ],
    exitOnError: false,
  });
}

module.exports = createServiceLogger;
