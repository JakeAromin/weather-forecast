import express, { Request, Response } from 'express';
import * as ForecastService from '../services/forecast.service';
import { Location } from '../models/location.type';
import { HTTP_STATUS_CODE } from '../utils/constants';

export const forecastRouter = express.Router();

forecastRouter.post("/location/:uuid", async (req: Request, res: Response) => {
    try {
        const uuid: string = req.params.uuid;
        const location: Location = {
            latitude: Number(req.body.latitude),
            longitude: Number(req.body.longitude)
        }
    
        if (!location.longitude || !location.latitude) {
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send('Invalid longitude or latitude.');
        }

        await ForecastService.setUserLocation(uuid, location);
        return res.status(HTTP_STATUS_CODE.OK).send({ id: uuid, ...location });
    } catch (err: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR).send(err.message);
    }
});
  
forecastRouter.get("/forecast/:uuid", async (req: Request, res: Response) => {
    try {
        const uuid: string = req.params.uuid;
        const foreCast: any = await ForecastService.getForecast(uuid);

        if (foreCast.statusCode) {
            return res.status(foreCast.statusCode).json(foreCast.message);
        }
        return res.status(HTTP_STATUS_CODE.OK).json(foreCast);
    } catch (err: any) {
        res.status(HTTP_STATUS_CODE.SERVER_ERROR).send(err.message);
    }
});