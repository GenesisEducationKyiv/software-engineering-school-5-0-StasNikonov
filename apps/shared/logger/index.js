const { createLogger, format, transports } = require('winston');

const shouldLog = (level) => {
  if (['error', 'warn'].includes(level)) return true;
  return Math.random() < 0.2;
};

const samplingFilter = format((info) => {
  return shouldLog(info.level) ? info : false;
});

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    samplingFilter(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
