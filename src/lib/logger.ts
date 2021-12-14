
import winston, { createLogger, format, transports } from 'winston';
import { config } from '../config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  access: 3,
  http: 4,
  debug: 5,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  access: 'white',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const baseFormatConfig = [
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.colorize({
    all: true,
  }),
];

const formatConfig = format.combine(
  ...baseFormatConfig,
  format.printf(info => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
  }),
);

const transportsConfig = [
  new transports.File({
    filename: `${config.APP_ROOT}/logs/eaglelizard-api.log`,
    format: format.combine(
      ...baseFormatConfig,
      // format.json(),
    )
  }),
  new transports.Console({
    format: format.combine(
      ...baseFormatConfig,
    )
  }),
];

export const logger = createLogger({
  level: 'info',
  levels,
  format: formatConfig,
  defaultMeta: { service: 'eaglelizard-api' },
  transports: transportsConfig,
});
