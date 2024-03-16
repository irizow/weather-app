import { currentHour } from "./fetchData";
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let isNight = false;
export let units = "celsius";
export let forecastType = "hourly";

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function kmhToMph(kmh) {
  return kmh / 1.609344;
}

function getWeatherCondition(response, loop, isHourly) {
  console.log("future features" + loop + isHourly);
  let values;
  let precipitationProb;
  let cloudCover;
  let snowIntensity;
  let rainIntensity;

  if (!isHourly) {
    values = response.timelines.daily[loop].values;
    precipitationProb = values.precipitationProbabilityAvg;
    rainIntensity = values.rainIntensityAvg;
    cloudCover = values.cloudCoverAvg;
    snowIntensity = values.snowIntensityAvg;
  } else if (isHourly) {
    values = response.timelines.hourly[loop].values;
    precipitationProb = values.precipitationProbability;
    rainIntensity = values.rainIntensity;
    cloudCover = values.cloudCover;
    snowIntensity = values.snowIntensity;
  }

  if (precipitationProb > 50 && rainIntensity > 0.55) {
    return "Storm";
  } else if (precipitationProb > 50 && rainIntensity < 0.5) {
    return "Rain";
  } else if (cloudCover < 25) {
    return "Clear";
  } else if (cloudCover > 25 && cloudCover < 50) {
    return "Partly Cloudy";
  } else if (precipitationProb > 50 && snowIntensity > 0) {
    return "Snow";
  } else if (cloudCover > 50) {
    return "Cloudy";
  }
  return "unknown";
}

function getWeatherAssets(weatherCondition, isNight) {
  const basePath = {
    backgrounds: "https://github.com/irizow/weather-app/tree/main/src/images/backgrounds/",
    icons: "https://github.com/irizow/weather-app/tree/main/src/images/weather-icons-master/svg/",
  };
  const assets = {
    Rain: {
      background: isNight ? "night-rain.jpg" : "day-rain.jpg",
      icon: isNight ? "wi-night-rain.svg" : "wi-day-rain.svg",
    },
    Clear: {
      background: isNight ? "clearest-night.jpg" : "clear.jpg", // Fixed typo here from 'cleares-night.jpg' to 'clearest-night.jpg'
      icon: isNight ? "wi-night-clear.svg" : "wi-day-sunny.svg",
    },
    Cloudy: {
      background: isNight ? "night-cloudy.jpg" : "blue-cloudy.jpg",
      icon: isNight ? "wi-night-cloudy.svg" : "wi-cloudy.svg",
    },
    Snow: {
      background: isNight ? "night-snow.jpg" : "snow.jpg",
      icon: isNight ? "wi-night-snow.svg" : "wi-snow.svg",
    },
    Storm: {
      background: "storm.jpg",
      icon: isNight ? "wi-night-storm-showers.svg" : "wi-thunderstorm.svg",
    },
    "Partly Cloudy": {
      background: isNight ? "night-partly.jpg" : "partly-cloudy.jpg",
      icon: isNight
        ? "wi-night-partly-cloudy.svg"
        : "wi-day-sunny-overcast.svg",
    },
  };

  let weatherAsset = assets[weatherCondition] || assets["Clear"];
  return {
    backgroundImage: `${basePath.backgrounds}${weatherAsset.background}`,
    icon: `${basePath.icons}${weatherAsset.icon}`,
  };
}

export function createWeatherCard(response) {
  console.log("createweatherresponse:" + response);
  const content = document.getElementById("content");
  content.innerHTML = " ";
  const weatherCard = document.createElement("div");
  const cardDiv1 = document.createElement("div");
  const cardDiv2 = document.createElement("div");
  cardDiv1.classList.add("card-div1");
  cardDiv2.classList.add("card-div2");
  weatherCard.classList.add("weathercard");
  const weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weathericon");
  let today = response.timelines.daily[0];
  const dayOfTheWeek = new Date(today.time);
  const dayOfTheWeekP = document.createElement("h2");
  dayOfTheWeekP.textContent = "Today, " + weekday[dayOfTheWeek.getDay()];
  const locationTime = document.createElement("h3");
  locationTime.textContent = currentHour;

  //is Night?
  let integHour = Number(currentHour.slice(0, 2));
  console.log("Integ Hour" + integHour);
  if (integHour < 6 || integHour > 20) {
    isNight = true;
  } else {
    isNight = false;
  }
  console.log("isNight: " + isNight);
  const locationName = document.createElement("h1");

  //Find out if the user typed a postcode and get the name out of the postcode
  let cityInput = response.location.name;
  if (isNaN(cityInput.substring(0, cityInput.indexOf(","))) === false) {
    let splitName = cityInput.split(",");
    let joinName = splitName[1] + ", " + splitName[2];
    locationName.textContent = joinName;
  } else {
    let splitName = cityInput.split(",");
    let joinName = splitName[0] + ", " + splitName[1];
    locationName.textContent = joinName;
  }

  const locationTemperature = document.createElement("h2");
  locationTemperature.style.fontSize = "30px";
  const locationWind = document.createElement("p");

  //switch from metric to imperial
  let temperatureValue = today.values.temperatureAvg;
  let windValue = today.values.windSpeedAvg * 3.6;
  if (units === "fahrenheit") {
    temperatureValue = celsiusToFahrenheit(temperatureValue);
    windValue = kmhToMph(windValue);
  }
  locationTemperature.textContent =
    Math.round(temperatureValue) + (units === "fahrenheit" ? "Fº" : "Cº");
  locationWind.textContent =
    "Wind Speed: " +
    Math.round(windValue) +
    (units === "fahrenheit" ? "Mph" : "Km/h");

  //Get background and icons
  let weatherCondition = getWeatherCondition(response, 0, false);
  let assets = getWeatherAssets(weatherCondition, isNight);
  weatherIcon.src = assets.icon;
  document.body.style.backgroundImage = `url('${assets.backgroundImage}')`;

  //other Elements
  const weatherConditionP = document.createElement("h2");
  weatherConditionP.textContent = weatherCondition;
  const locationUvIndex = document.createElement("p");
  locationUvIndex.textContent = "Uv Index: " + today.values.uvIndexAvg;
  const locationPrecProb = document.createElement("p");
  locationPrecProb.textContent =
    "Chances of Rain: " + today.values.precipitationProbabilityAvg + "%";
  const locationHumidity = document.createElement("p");
  locationHumidity.textContent = "Humidity: " + today.values.humidityAvg + "%";

  cardDiv1.append(
    weatherIcon,
    locationName,
    weatherConditionP,
    locationTime,
    locationTemperature,
  );
  cardDiv2.append(
    dayOfTheWeekP,
    locationHumidity,
    locationWind,
    locationPrecProb,
    locationUvIndex,
  );
  weatherCard.append(cardDiv1, cardDiv2);
  content.appendChild(weatherCard);

  return weatherCard;
}

export async function createFiveDayForecast(response) {
  console.log(response);
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = " ";
  const forecastCardsDiv = document.createElement("div");
  forecastCardsDiv.classList.add("forecastcardsdiv");

  if (forecastType === "daily") {
    for (let i = 0; i < 5; i++) {
      let forecastCard = document.createElement("div");
      let dayOfTheWeek = new Date(response.timelines.daily[i].time);
      let dayOfTheWeekP = document.createElement("p");
      dayOfTheWeekP.textContent = weekday[dayOfTheWeek.getDay()];
      forecastCard.classList.add("forecastcard");
      let forecasticon = document.createElement("img");
      let futureDayMinTemp = document.createElement("p");
      let futureDayMaxTemp = document.createElement("p");

      //get WeatherCondition
      let weatherCondition = getWeatherCondition(response, i, false);
      let assets = getWeatherAssets(weatherCondition, false);
      forecasticon.src = assets.icon;

      let temperatureMaxValue =
        response.timelines.daily[i].values.temperatureMax;
      let temperatureMinValue =
        response.timelines.daily[i].values.temperatureMin;
      if (units === "fahrenheit") {
        temperatureMaxValue = celsiusToFahrenheit(temperatureMaxValue);
        temperatureMinValue = celsiusToFahrenheit(temperatureMinValue);
      }
      futureDayMaxTemp.textContent =
        Math.round(temperatureMaxValue) +
        (units === "fahrenheit" ? "Fº" : "Cº");
      futureDayMinTemp.textContent =
        Math.round(temperatureMinValue) +
        (units === "fahrenheit" ? "Fº" : "Cº");

      forecastCard.append(
        dayOfTheWeekP,
        forecasticon,
        futureDayMinTemp,
        futureDayMaxTemp,
      );
      forecastCardsDiv.appendChild(forecastCard);
    }
  } else if (forecastType === "hourly") {
    let hourCounter = 1;
    let nextHour = Number(currentHour.toString().slice(0, 2)) + 1;
    console.log("currenthournew:" + nextHour);

    for (let i = 0; i < 6; i++) {
      console.log(i);
      let forecastCard = document.createElement("div");
      let hourOfDayP = document.createElement("p");

      hourOfDayP.textContent = nextHour + ":00";
      forecastCard.classList.add("forecastcard");
      let forecasticon = document.createElement("img");
      let hourlyTemperature = document.createElement("p");

      let weatherCondition = getWeatherCondition(response, hourCounter, true);
      let assets = getWeatherAssets(weatherCondition, false);
      forecasticon.src = assets.icon;

      let temperatureValue =
        response.timelines.hourly[hourCounter].values.temperature;
      if (units === "fahrenheit") {
        temperatureValue = celsiusToFahrenheit(temperatureValue);
      }
      hourlyTemperature.textContent =
        Math.round(temperatureValue) + (units === "fahrenheit" ? "Fº" : "Cº");

      forecastCard.append(hourOfDayP, forecasticon, hourlyTemperature);
      forecastCardsDiv.appendChild(forecastCard);
      hourCounter = hourCounter + 4;
      if (nextHour < 24) {
        nextHour = nextHour + 4;
      }
      if (nextHour >= 24) {
        switch (nextHour) {
          case 24:
            nextHour = 0;
            break;

          case 25:
            nextHour = 1;
            break;
          case 26:
            nextHour = 2;
            break;
          case 27:
            nextHour = 3;
            break;
        }
      }
    }
  }

  forecastDiv.appendChild(forecastCardsDiv);
}
