import { forecastType, units } from "./pageLoad";
import { createWeatherCard } from "./pageLoad";
import { getWeather, getFutureWeather } from "./fetchData";

const switchButton = document.querySelector(".switch-input");
const cityInput = document.getElementById("location-input");
const magnifyingGlass = document.getElementById("magnifying");
const hourlyButton = document.getElementById("hourly-button");
const dailyButton = document.getElementById("daily-button");
export let city = "barcelona";


export function loadEventListeners() {

window.addEventListener("load", ()=> { 
    getWeather(city);
    })

magnifyingGlass.addEventListener("click", ()=> {
    console.log("glass clicked");
    city = cityInput.value
    getWeather(city);

    return city
});

switchButton.addEventListener("click", ()=> {
 units = "fahrenheit";
 getWeather(city);

})

hourlyButton.addEventListener("click", ()=> {
    if(forecastType === "daily") {
        forecastType = "hourly";
        getWeather(city);

    }
})

dailyButton.addEventListener("click", ()=> {
    if(forecastType === "hourly") {
        forecastType = "daily";
        getWeather(city);
    
    }
})


}



