import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { forecastRouter } from './routers/forecast.router';
//import { errorHandler } from './middleware/error.middleware';
//import { notFoundHandler } from './middleware/not-found.middleware';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use('/api', forecastRouter);

//server.use(errorHandler);
//server.use(notFoundHandler);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});