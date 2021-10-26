# Weather Forecast

A simple API demonstration that set user/system location then call Darksky API to retrieve weather forecast.

## API Docs
Will be available soom at /api-docs

### POST /api/location/{id}
ID is the user or systems ID.

#### Example request body
```json
{
    "latitude": -13.34233434,
    "longitude": 174.70226303649034
}
```

## GET /api/forecast/{id}
ID is the user or systems ID.

#### Example response body
```json
{
    "summary": "Humid and Overcast",
    "windSpeed": 6.77,
    "windGust": 7.62,
    "hourly": [
        {
            "timestamp": "26/10/2021, 11:00:00 pm",
            "temperature": 27.56
        },
        {
            "timestamp": "27/10/2021, 12:00:00 am",
            "temperature": 27.4
        }
    ]
}
```
