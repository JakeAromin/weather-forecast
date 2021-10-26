import express, { Request, Response } from 'express';
import apichache from 'apicache';

import * as ForecastService from '../services/forecast.service';
import { logger } from '../utils/logger';
import { Location } from '../models/location.type';
import { HTTP_STATUS_CODE, HTTP_CACHE_MINS } from '../utils/constants';

export const forecastRouter = express.Router();

/**
 * POST endpoint that accepts uuid as path params and location body params, then store them in memory.
 * 
 * Note: 
 *  1. To use versioning use something like '/v1/location/:uuid'
 * 
 */
forecastRouter.post("/location/:uuid", async (req: Request, res: Response) => {
    try {
        const uuid: string = req.params.uuid;
        const location: Location = {
            latitude: Number(req.body.latitude),
            longitude: Number(req.body.longitude)
        }
    
        if (!location.longitude || !location.latitude) {
            logger.debug(`Invalid location: ${location.longitude} - ${location.latitude}`);
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send('Invalid longitude or latitude.');
        }

        await ForecastService.setUserLocation(uuid, location);
        
        setHeader(req.method, res); 
        res.status(HTTP_STATUS_CODE.OK).send({ id: uuid, ...location });
    } catch (err: any) {
        logger.error(`${err}`);
        res.status(HTTP_STATUS_CODE.SERVER_ERROR).send(err.message);
    }
});
  
/**
 * GET endpoint that accept uuid path param, then use Darksky client to retrieve weather forecast agains the location of the user/system
 * 
 */
forecastRouter.get("/forecast/:uuid",  apichache.middleware(HTTP_CACHE_MINS), async (req: Request, res: Response) => {
    try {
        const uuid: string = req.params.uuid;
        const foreCast: any = await ForecastService.getForecast(uuid);

        if (foreCast.statusCode) {
            logger.debug(`${foreCast.statusCode} - ${foreCast.message}`);
            return res.status(foreCast.statusCode).json(foreCast.message);
        }

        setHeader(req.method, res);        
        res.status(HTTP_STATUS_CODE.OK).json(foreCast);
    } catch (err: any) {
        logger.error(`${err}`);
        res.status(HTTP_STATUS_CODE.SERVER_ERROR).send(err.message);
    }
});


const setHeader = (method: string, res: Response) => {
    if (method == 'GET') {
        res.set('Cache-control', 'public, max-age=300');
    } else {
        res.set('Cache-control', 'no-store');
    }
};