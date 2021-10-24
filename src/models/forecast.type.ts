export type Currently = {
    summary: string;
    windSpeed: number;
    windGust: number;
}

export type HourData = {
    timestamp: Date,
    temperature: number
}

export type Forecast = Currently & {
    hourly: [HourData]
}