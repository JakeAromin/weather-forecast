import { Location } from '../models/location.type';
import { UsersLocation } from '../models/users.location.type';
import { Forecast } from '../models/forecast.type';
import { DarkSkyClient } from '../clients/darkSky.client';
import { ErrorMessage  } from '../utils/types.util';
import { HTTP_STATUS_CODE } from '../utils/constants';

let usersLocation: UsersLocation = {};

export const setUserLocation = async ( uuid: string, location: Location ): Promise<Location> => {  
    
    usersLocation[uuid] = {
        ...location,
    };
    return usersLocation[uuid];
};

export const getUserLocation = async ( uuid: string): Promise<Location> => {
    return usersLocation[uuid];
}

export const getForecast = async( uuid: string ): Promise<Forecast | ErrorMessage> => {

    const location: Location = usersLocation[uuid];
    if (!location) {
        const errorMessage: ErrorMessage = {
            statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
            message: `Location of the user ${uuid} not defined.`
        };
        return errorMessage;
    }

    let darkSkyClient = DarkSkyClient();
    const response: any = await darkSkyClient.getForecast(location);

    return response;
};