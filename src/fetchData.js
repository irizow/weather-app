import { createWeatherCard, createFiveDayForecast } from "./pageLoad";
import { city } from "./DOMEventListeners";

export const options = {
  method: "GET",
  headers: { accept: "application/json" },
};
export let currentHour;

export async function getFutureWeather(city) {
  try {
    const response = await fetch(
      `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=Myn196y0vihIZSTNpL5yNZ0gU0PBPdLY`,
      options,
    );
    const data = await response.json();
    await getTimeZoneData(data, data.location.lat, data.location.lon);
  } catch (error) {
    console.error(error);
    alert('Sorry, "too many" requests within an hour for this free tier API :) sponsor me and I will get the premium one so you can see if it will rain tomorrow. Or try again in some minutes.')
  }
}

export async function getTimeZoneData(data, lat, long) {
  try {
    const timeZoneResponse = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=B4K4P9U2INY5&format=json&by=position&lat=${lat}&lng=${long}`,
    );
    const timeZoneData = await timeZoneResponse.json();
    const timeZoneString = timeZoneData.formatted;
    const cityTime = timeZoneString.substring(
      timeZoneData.formatted.indexOf(":") - 2,
      timeZoneData.formatted.indexOf(":") + 3,
    );
    currentHour = cityTime;
    await createWeatherCard(data);
    createFiveDayForecast(data);
  } catch (error) {
    console.error(error);
  }
}

export function getUserLocation() {
  const successCallback = (position) => {
    console.log(position);
    reverseGeolocation(position);
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

function reverseGeolocation(position) {
  fetch(
    `https://us1.locationiq.com/v1/reverse?key=pk.f37b37fa95ad947d134bbcff6585b6d9&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
  )
    .then((response) => response.json())
    .then(function (response) {
      console.log(response);
      city = response.address.postcode;
      getFutureWeather(city);
      return city;
    })
    .catch((err) => console.log(err));
}
