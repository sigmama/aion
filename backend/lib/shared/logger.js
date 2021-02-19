const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf } = format;

const myFormat = printf(({ message, timestamp: tsp }) => {
  const [job, msg] = message.split("|||");
  return `[time:${tsp}] - [job:${job}] - [msg:${msg}]`;
});

const errLogger = createLogger({
  transports: new transports.File({
    filename: "logs/error.log",
    level: "error",
    format: combine(timestamp(), myFormat)
  })
});

const warnLogger = createLogger({
  transports: new transports.File({
    filename: "logs/warn.log",
    level: "warn",
    format: combine(timestamp(), myFormat)
  })
});

const infoLogger = createLogger({
  transports: new transports.File({
    filename: "logs/info.log",
    level: "info",
    format: combine(timestamp(), myFormat)
  })
});

module.exports = {
  errLogger,
  warnLogger,
  infoLogger
};
