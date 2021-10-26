import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import winston from 'winston';
import expressWinston, { LoggerOptions } from 'express-winston';

import { forecastRouter } from './routers/forecast.router';
//import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './utils/error.notFound.middleware';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);

export const server = express();

server.use(bodyParser.json());
server.use(helmet());
server.use(cors());
server.use(express.json());

const winstonOptions: LoggerOptions = {
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
};

//set expressWinston before routers
server.use(expressWinston.logger(winstonOptions));

server.use('/api', forecastRouter);

// express-winston errorLogger makes sense AFTER the router.
server.use(expressWinston.errorLogger(winstonOptions));

//server.use(errorHandler);
server.use(notFoundHandler);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

