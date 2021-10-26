import winston from 'winston';

export const logger = winston.createLogger({
	level: 'debug',
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.colorize(),
		winston.format.json()
	)
});