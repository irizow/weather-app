import { getTimeZoneData } from "./fetchData";
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let isNight = false;
export let units = "celsius";

export function createWeatherCard(response) {
    console.log(response);
    const content = document.getElementById("content");
    content.innerHTML = " ";
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("weathercard");
    const weatherIcon = document.createElement("img");
    weatherIcon.classList.add("weathericon");
    const dOfTheWeek = new Date(response.data.time);
    const hours = dOfTheWeek.getHours();
    if(hours < 6 && hours > 20) {
        isNight = true;
    }
    else {
        isNight = false;
    }
    const dayOfTheWeek = document.createElement("h2");
    dayOfTheWeek.textContent = "Today, " + weekday[dOfTheWeek.getDay()];
    const locationTime = document.createElement("h3");
    function getTimeZoneData(lat, long) {
        fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=B4K4P9U2INY5&format=json&by=position&lat=${lat}&lng=${long}`)
        .then(timeZoneData => timeZoneData.json())
        .then(function (timeZoneData) {
          let timeZoneString  = timeZoneData.formatted;
          console.log(timeZoneString);
          let cityTime = timeZoneString.substring(timeZoneData.formatted.indexOf(":") - 2, timeZoneData.formatted.indexOf(":")+3);
          console.log(cityTime);
          locationTime.textContent = cityTime;
        })
        .catch(err => console.error(err));
      }

      getTimeZoneData(response.location.lat, response.location.lon);
    
    const locationName = document.createElement("h1");
    if (typeof Math.round(response.location.name.charAt(0) === "number")) {
        locationName.textContent = response.location.name.substring(response.location.name.indexOf(",") +2, response.location.name.indexOf(",", response.location.name.indexOf(",") +1))
    }

    else {
        locationName.textContent = response.location.name.substring(0, response.location.name.indexOf(","));
    }
    const locationTemperature = document.createElement("h2");
    const locationWind = document.createElement("p");
    if(units === "celsius") {
    locationTemperature.textContent = response.data.values.temperature + "ºC";
    locationWind.textContent = "Wind Speed: " + Math.round(response.data.values.windSpeed*3.6) + " Km/h"
    }
    else if (units === "farenheit") {
        locationTemperature.textContent = response.data.values.temperature * (9/5) + 32 + "ºF";
        locationWind.textContent = "Wind Speed: " + Math.round(response.data.values.windSpeed* 2,237) + " mph";    
    }
    const locationHumidity = document.createElement("p");
    locationHumidity.textContent = "Humidity: " + response.data.values.humidity + "%";
    if(response.data.values.precipitationProbability > 50 && response.data.values.rainIntensity > 0.55) {
        weatherIcon.src = "../src/images/icons/cloud-rain.svg"
        if (!isNight) {
        document.body.style.backgroundImage = "url('../src/images/backgrounds/storm.jpg')";}
        else {}
    }

    else if(response.data.values.precipitationProbability > 50 && response.data.values.rainIntensity < 0.5) {
        weatherIcon.src = "../src/images/icons/cloud-rain.svg"
        if (!isNight) {
        document.body.style.backgroundImage = "url('../src/images/backgrounds/rain.jpg')";
        }
        else {
            document.body.style.backgroundImage = "url('../src/images/backgrounds/night-rain.jpg')";
        }
    }

    else if (response.data.values.cloudCover < 25) {
        weatherIcon.src = "../src/images/icons/sunny.svg";
        if (!isNight) {
        document.body.style.backgroundImage = "url('../src/images/backgrounds/clear.jpg')";}
        else {
            document.body.style.backgroundImage = "url('../src/images/backgrounds/clearest-night.jpg')";
        }
    }

    else if (response.data.values.cloudCover > 25 && response.data.values.cloudCover < 50) {
        weatherIcon.src = "../src/images/icons/cloud-sun.svg";
        if(!isNight) {
        document.body.style.backgroundImage = "url('../src/images/backgrounds/cloudy.jpg')";}
        else{
            document.body.style.backgroundImage = "url('../src/images/backgrounds/night-cloudy.jpg')";}
    }

    else if (response.data.values.cloudCover > 50) {
        weatherIcon.src = "../src/images/icons/cloud-forecast.svg"
        if(!isNight) {
        document.body.style.backgroundImage = "url('../src/images/backgrounds/cloudy.jpg')";}
        else {
            document.body.style.backgroundImage = "url('../src/images/backgrounds/night-cloudy.jpg')";
        }
    }


    weatherCard.appendChild(weatherIcon);
    weatherCard.appendChild(dayOfTheWeek);
    weatherCard.append(locationTime, locationName, locationTemperature, locationHumidity, locationWind);
    content.appendChild(weatherCard);

    return weatherCard;

}


export function createFiveDayForecast(response) {
    console.log(response)
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = " ";
    const futureCardsDiv = document.createElement("div");
    futureCardsDiv.classList.add("futurecardsdiv");
    for(let i = 1; i < 6; i++) {
        console.log(i);
        let futureDayCard = document.createElement("div");
        let dOfTheWeek = new Date(response.timelines.daily[i].time);
        let dayOfTheWeek = document.createElement("p");
        dayOfTheWeek.textContent = weekday[dOfTheWeek.getDay()];
        futureDayCard.classList.add("futuredaycard");
        let futureDayIcon = document.createElement("img");
        let futureDayMinTemp = document.createElement("p");
        let futureDayMaxTemp = document.createElement("p");
        if (response.timelines.daily[i].values.precipitationProbabilityAvg > 50) {
            futureDayIcon.src = "../src/images/icons/cloud-rain.svg"
        }
    
        else if (response.timelines.daily[i].values.precipitationProbabilityAvg < 25) {
            futureDayIcon.src = "../src/images/icons/sunny.svg"
        }
    
        else if (response.timelines.daily[i].values.precipitationProbabilityAvg > 25 && response.timelines.daily[i].values.precipitationProbabilityAvg < 50) {
            futureDayIcon.src = "../src/images/icons/cloud-sun.svg"
        }
    
        else if (response.timelines.daily[i].values.precipitationProbabilityAvg > 50) {
            futureDayIcon.src = "../src/images/icons/cloud-forecast.svg"
        }
        if( units === "celsius") {
            futureDayMaxTemp.textContent = "Max: " + Math.round(response.timelines.daily[i].values.temperatureMax) + "ºC";
            futureDayMinTemp.textContent = "Min: " + Math.round(response.timelines.daily[i].values.temperatureMin) + "ºC";
        }

        else if( units === "fareinheit") {
            futureDayMaxTemp.textContent = "Max: " + Math.round(response.timelines.daily[i].values.temperatureMax * (9/5) + 32) + "ºF";
            futureDayMinTemp.textContent = "Min: " + Math.round(response.timelines.daily[i].values.temperatureMin * (9/5) + 32) + "ºF";

        }
        futureDayCard.append(dayOfTheWeek, futureDayIcon, futureDayMinTemp, futureDayMaxTemp);
        futureCardsDiv.appendChild(futureDayCard);


    }
    forecastDiv.appendChild(futureCardsDiv);

}


