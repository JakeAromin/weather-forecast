import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import urljoin from "url-join";
import { Currently, Forecast, HourData } from '../models/forecast.type';
import { Location } from '../models/location.type';
import { ErrorMessage } from '../utils/types.util';
import { DARKSKY_TIMEOUT, DARKSKY_UNITS, CUSTOM_HEADER, HTTP_STATUS_CODE } from '../utils/constants';

export const DarkSkyClient = () => ({

    /**
     * Prepares AxiosRequestConfig
     * 
     * @returns config
     */
    getConfig(): AxiosRequestConfig {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.DARKSKY_BASE_URL}/${process.env.DARKSKY_KEY}`,
            timeout: Number(process.env.DARKSKY_TIMEOUT) || DARKSKY_TIMEOUT,
            headers: {'X-Custom-Header': CUSTOM_HEADER}
        };
        return config;
    },

    /**
     * Calls Darksky POST API to retrieve the weather forecast of a location.
     * 
     * @param location 
     * @returns  Forecast | ErrorMessage
     */
    async getForecast(location: Location): Promise<Forecast | ErrorMessage> {
        const url = urljoin(`/${location.latitude},${location.longitude}`, `?units=${process.env.DARKSKY_UNITS || DARKSKY_UNITS}`);

        let result: any;
        await axios.get(url, this.getConfig())
        .then( (response: AxiosResponse<any, null>) => {
            const currentlyData: any = response.data.currently;
            const currently: Currently = {
                summary: currentlyData.summary,
                windSpeed: currentlyData.windSpeed,
                windGust: currentlyData.windGust
            };

            const hourlyData = response.data.hourly.data;
            const hourly: [HourData] = hourlyData.map( (item: any) =>  { 
                const dateTime = new Date(item.time * 1000);
                return {
                    timestamp: dateTime.toLocaleString(),
                    temperature: item.temperature
                }; 
            });

            const foreCast: Forecast = {
                ...currently,
                hourly
            };
            result =  foreCast;
        })
        .catch( (error) => {
            let statusMessage: ErrorMessage;
            if (error.response) {
                statusMessage = {
                    statusCode: error.response.status,
                    message: error.response.statusText,
                };
            } else {
                statusMessage = {
                    statusCode: HTTP_STATUS_CODE.SERVER_ERROR,
                    message: error.message,
                }
            }
            result =  statusMessage;
        });

        return result;
    }

});
