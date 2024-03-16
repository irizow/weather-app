import { currentHour } from "./fetchData";
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let isNight = false;
export let units = "celsius";
export  let isTimeResolved = false;
export let forecastType = "hourly";


function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function kmhToMph(kmh) {
    return kmh / 1.609344;
}

function getWeatherCondition(response) {
    const { values } = response.data;
    
    if (values.precipitationProbability > 50 && values.rainIntensity > 0.55) {
        return 'Storm';
    } else if (values.precipitationProbability > 50 && values.rainIntensity < 0.5) {
        return 'Rain';
    } else if (values.cloudCover < 25) {
        return 'Clear';
    } else if (values.cloudCover > 25 && values.cloudCover < 50) {
        return 'Partly Cloudy';
    } else if (values.precipitationProbability > 50 && values.snowIntensity > 0) {
        return 'Snow';
    } else if (values.cloudCover > 50) {
        return 'Cloudy';
    }
    return 'unknown';

}

function getFutureWeatherCondition(response, loop, isHourly) {
    console.log("future features" + loop + isHourly)
    let values;
    if(!isHourly) {
    values = response.timelines.daily[loop] }
    else if(isHourly) {
    values = response.timelines.hourly[loop]
    }
    
    if (values.precipitationProbabilityAvg > 50 && values.rainIntensityAvg > 0.55) {
        return 'Storm';
    } else if (values.precipitationProbabilityAvg > 50 && values.rainIntensityAvg < 0.5) {
        return 'Rain';
    } else if (values.cloudCoverAvg < 25) {
        return 'Clear';
    } else if (values.cloudCoverAvg > 25 && values.cloudCoverAvg < 50) {
        return 'Partly Cloudy';
    } else if (values.precipitationProbabilityAvg > 50 && values.snowIntensityAvg > 0) {
        return 'Snow';
    } else if (values.cloudCoverAvg > 50) {
        return 'Cloudy';
    }
    return 'unknown';

}

function getWeatherAssets(weatherCondition, isNight) {
    const basePath = {
        backgrounds: '../src/images/backgrounds/',
        icons: '../src/images/weather-icons-master/svg/'
    };
    const assets = {
        Rain: {
            background: isNight ? 'night-rain.jpg' : 'rain.jpg',
            icon: isNight ? 'wi-night-rain.svg' : 'wi-day-rain.svg'
        },
        Clear: {
            background: isNight ? 'clearest-night.jpg' : 'clear.jpg', // Fixed typo here from 'cleares-night.jpg' to 'clearest-night.jpg'
            icon: isNight ? 'wi-night-clear.svg' : 'wi-day-sunny.svg'
        },
        Cloudy: {
            background: isNight ? 'night-cloudy.jpg' : 'cloudy.jpg',
            icon: isNight? 'wi-night-cloudy.svg' : 'wi-cloudy.svg'
        },
        Snow: {
            background: isNight ? 'night-snow.jpg' : 'snow.jpg',
            icon: isNight ? 'wi-night-snow.svg' : 'wi-snow.svg'
        },
        Storm: {
            background: 'storm.jpg',
            icon: isNight ? 'wi-night-storm-showers.svg' : 'wi-thunderstorm.svg'
        },
        'Partly Cloudy': {
            background: isNight ? 'night-partly.jpg' : 'partly-cloudy.jpg',
            icon: isNight ? 'wi-night-partly-cloudy.svg' : 'wi-day-sunny-overcast.svg' // Fixed icon for Partly Cloudy during the day
        }
    };

    let weatherAsset = assets[weatherCondition] || assets['Clear']; // Default to 'Clear' if condition is not found

    return {
        backgroundImage: `${basePath.backgrounds}${weatherAsset.background}`,
        icon: `${basePath.icons}${weatherAsset.icon}`
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
    const dayOfTheWeek = new Date(response.data.time);
    const dayOfTheWeekP = document.createElement("h2");
    dayOfTheWeekP.textContent = "Today, " + weekday[dayOfTheWeek.getDay()];
    const locationTime = document.createElement("h3");
    locationTime.textContent = currentHour;

    //is Night?
    let integHour = Number(currentHour.slice(0,2));
    console.log("Integ Hour" + integHour);
    if(integHour < 6 || integHour > 20) {
        isNight = true;
    }
    else {
        isNight = false;
    }
    console.log("isNight: " + isNight)
    const locationName = document.createElement("h1");


    //Find out if the user typed a postcode and get the name out of the postcode
    let cityInput = response.location.name;
    if (isNaN(cityInput.substring(0, cityInput.indexOf(","))) === false) {
        console.log( Math.round(cityInput.substring(0, cityInput.indexOf(","))))
        locationName.textContent = cityInput.substring(response.location.name.indexOf(",") +2, cityInput.indexOf(",", cityInput.indexOf(",") +1))
    }

    else {
        locationName.textContent = cityInput.substring(0, cityInput.indexOf(","));
    }

    const locationTemperature = document.createElement("h2");
    locationTemperature.style.fontSize = "30px";
    const locationWind = document.createElement("p");

    //switch from metric to imperial
    let temperatureValue = response.data.values.temperature;
    let windValue = response.data.values.windSpeed*3.6;
    if(units === "fahrenheit") {
        temperatureValue = celsiusToFahrenheit(temperatureValue);
        windValue = kmhToMph(windValue);
    }
        locationTemperature.textContent = Math.round(temperatureValue) + (units === "fahrenheit" ? "Fº" : "Cº");
        locationWind.textContent = "Wind Speed: " + Math.round(windValue) + (units === "fahrenheit" ? "Mph" : "Km/h")
    
        

    //Get background and icons
    let weatherCondition = getWeatherCondition(response);
    let assets = getWeatherAssets(weatherCondition, isNight);
    weatherIcon.src = assets.icon
    document.body.style.backgroundImage = `url('${assets.backgroundImage}')`

    //other Elements
    const weatherConditionP = document.createElement("h2");
    weatherConditionP.textContent = weatherCondition;
    const locationUvIndex = document.createElement("p");
    locationUvIndex.textContent = "Uv Index: " + response.data.values.uvIndex;
    const locationPrecProb = document.createElement("p");
    locationPrecProb.textContent = "Chances of Rain: " + response.data.values.precipitationProbability + "%";
    const locationHumidity = document.createElement("p");
    locationHumidity.textContent = "Humidity: " + response.data.values.humidity + "%";
    

    cardDiv1.append(weatherIcon, locationName, weatherConditionP, locationTime, locationTemperature);
    cardDiv2.append(dayOfTheWeekP, locationHumidity, locationWind, locationPrecProb, locationUvIndex)
    weatherCard.append(cardDiv1, cardDiv2);
    content.appendChild(weatherCard);

    return weatherCard;

}


export async function createFiveDayForecast(response) {
    console.log(response)
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = " ";
    const forecastCardsDiv = document.createElement("div");
    forecastCardsDiv.classList.add("forecastcardsdiv");

    if(forecastType === "daily") {
        for(let i = 0; i < 5; i++) {
            let forecastCard = document.createElement("div");
            let dayOfTheWeek = new Date(response.timelines.daily[i].time);
            let dayOfTheWeekP = document.createElement("p");
            dayOfTheWeekP.textContent = weekday[dayOfTheWeek.getDay()];
            forecastCard.classList.add("forecastcard");
            let forecasticon = document.createElement("img");
            let futureDayMinTemp = document.createElement("p");
            let futureDayMaxTemp = document.createElement("p");

            //get WeatherCondition
            let weatherCondition = getFutureWeatherCondition(response, i, false);
            let assets = getWeatherAssets(weatherCondition, false);
            forecasticon.src = assets.icon;
           
            let temperatureMaxValue = response.timelines.daily[i].values.temperatureMax;
            let temperatureMinValue = response.timelines.daily[i].values.temperatureMin;
                if(units === "fahrenheit") {
                    temperatureMaxValue = celsiusToFahrenheit(temperatureMaxValue);
                    temperatureMinValue = celsiusToFahrenheit(temperatureMinValue);
                }
                    futureDayMaxTemp.textContent = Math.round(temperatureMaxValue) + (units === "fahrenheit" ? "Fº" : "Cº");
                    futureDatMinTemp.textContent = Math.round(temperatureMinValue) + (units === "fahrenheit" ? "Fº" : "Cº")
            
           
            forecastCard.append(dayOfTheWeekP, forecasticon, futureDayMinTemp, futureDayMaxTemp);
            forecastCardsDiv.appendChild(forecastCard);
        
        }}

        else if(forecastType === "hourly") {
            let hourCounter = 1;
            let nextHour = Number(currentHour.toString().slice(0, 2)) + 1;
            console.log("currenthournew:" + nextHour);
        


            for(let i = 0; i < 6 ; i++) {
                console.log(i);
                let forecastCard = document.createElement("div");
                let hourOfDayP = document.createElement("p");
                
                hourOfDayP.textContent = nextHour + ":00";
                forecastCard.classList.add("forecastcard");
                let forecasticon = document.createElement("img");
                let hourlyTemperature = document.createElement("p");

                let weatherCondition = getFutureWeatherCondition(response, hourCounter, true);
                let assets = getWeatherAssets(weatherCondition, false);
                forecasticon.src = assets.icon;

                let temperatureValue = response.timelines.hourly[hourCounter].values.temperature;
                if(units === "fahrenheit") {
                    temperatureValue = celsiusToFahrenheit(temperatureValue);
                }
                   hourlyTemperature.textContent = Math.round(temperatureValue) + (units === "fahrenheit" ? "Fº" : "Cº");
            
                forecastCard.append(hourOfDayP, forecasticon, hourlyTemperature);
                forecastCardsDiv.appendChild(forecastCard); 
                hourCounter = hourCounter +4;
                if(nextHour < 24) {
                nextHour = nextHour +4;
                }
                if(nextHour >= 24) {
                    switch(nextHour) {
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




