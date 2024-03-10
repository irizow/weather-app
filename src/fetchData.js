import { createWeatherCard, createFiveDayForecast } from "./pageLoad";

export const options = {method: 'GET', headers: {accept: 'application/json'}};

export function getWeather(city) {
fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=Myn196y0vihIZSTNpL5yNZ0gU0PBPdLY`, options)
  .then(response => response.json())
  .then(response => createWeatherCard(response))
  .catch(err => console.error(err));

}


export function getFutureWeather(city) {
fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=Myn196y0vihIZSTNpL5yNZ0gU0PBPdLY`, options)
  .then(response => response.json())
  .then(response => createFiveDayForecast(response))
  .catch(err => console.error(err));
}

 function getTimeZoneData(lat, long) {
  fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=B4K4P9U2INY5&format=json&by=position&lat=${lat}&lng=${long}`)
  .then(timeZoneData => timeZoneData.json())
  .then(function (timeZoneData) {
    let timeZoneString  = timeZoneData.formatted;
    console.log(timeZoneString);
    let cityTime = timeZoneString.substring(timeZoneData.formatted.indexOf(":") - 2, timeZoneData.formatted.indexOf(":")+3);
    console.log(cityTime);
    return cityTime;
  })
  .catch(err => console.error(err));
}