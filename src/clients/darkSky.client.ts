import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import urljoin from "url-join";
import { Currently, Forecast, HourData } from '../models/forecast.type';
import { Location } from '../models/location.type';
import { ErrorMessage } from '../utils/types.util';
import { DARKSKY_TIMEOUT, DARKSKY_UNITS, CUSTOM_HEADER, HTTP_STATUS_CODE } from '../utils/constants';

const config: AxiosRequestConfig = {
    baseURL: `${process.env.DARKSKY_BASE_URL}/${process.env.DARKSKY_KEY}`,
    timeout: Number(process.env.DARKSKY_TIMEOUT) || DARKSKY_TIMEOUT,
    headers: {'X-Custom-Header': CUSTOM_HEADER}
}; 
let axiosInstance = axios.create(config);

export const DarkSkyClient = () => ({

    async getForecast(location: Location): Promise<Forecast | ErrorMessage> {
        const url = urljoin(`/${location.latitude},${location.longitude}`, `?units=${process.env.DARKSKY_UNITS || DARKSKY_UNITS}`);

        let result: any;
        await axiosInstance.get(url)
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