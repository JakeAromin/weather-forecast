import * as dotenv from 'dotenv';
import { DarkSkyClient } from '../../../src/clients/darkSky.client';
import { Location } from '../../../src/models/location.type';
import { expect } from 'chai';
import { AxiosRequestConfig } from 'axios';
import { HourData } from '../../../src/models/forecast.type';


describe('DarkSkyClient tests', () => {

    let darkSkyClient: any = null;

    beforeEach(async () => {
        darkSkyClient = DarkSkyClient();
    });

    it('getConfig should read env variables and return valid avios config', async () => {
        process.env.DARKSKY_BASE_URL = 'http://api/';
        process.env.DARKSKY_KEY = 'key1';
        process.env.DARKSKY_TIMEOUT = '1000';

        const config: AxiosRequestConfig =  darkSkyClient.getConfig();
        const baseURL = `${process.env.DARKSKY_BASE_URL}/${process.env.DARKSKY_KEY}`;
        expect(config.baseURL).to.be.eq(baseURL);
        expect(config.timeout).to.be.eq(Number(process.env.DARKSKY_TIMEOUT));
    });

    it('getForecast should return a server error 500', async () => { 
        process.env.DARKSKY_BASE_URL = 'http://api/';

        const location: Location = {
            latitude: -36.81146514936358,
            longitude: 174.70226303649034
        }

        const result = await darkSkyClient.getForecast(location);
        
        expect(result.statusCode).to.be.eq(500);
    });

    it('getForecast should return an error message with response status', async () => { 
        setEnv();

        //invalid location
        const location: Location = {
            latitude: 123,
            longitude: 123
        }

        const result = await darkSkyClient.getForecast(location);
        expect(result.statusCode).to.be.eq(400);
    });

    it('getForecast should return success with response status', async () => { 
        setEnv();

        //valid location
        const location: Location = {
            latitude: -36.81146514936358,
            longitude: 174.70226303649034
        }

        const result = await darkSkyClient.getForecast(location);
        expect(result.summary).not.to.be.null;
        expect(result.windSpeed).not.to.be.null;
        expect(result.hourly).not.to.be.null;
        expect(result.hourly).to.be.an('array');
    });

});


const setEnv = () => {
     //dafault to use .env
    const parsed: any = dotenv.config({ path: './.env' }).parsed;
    process.env.DARKSKY_BASE_URL = parsed.DARKSKY_BASE_URL;
    process.env.DARKSKY_KEY = parsed.DARKSKY_KEY;
    process.env.DARKSKY_UNITS = parsed.DARKSKY_UNITS;
    process.env.DARKSKY_TIMEOUT = parsed.DARKSKY_TIMEOUT;
};