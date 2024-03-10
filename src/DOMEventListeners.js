import { units } from "./pageLoad";
import { createWeatherCard } from "./pageLoad";
import { getWeather, getFutureWeather } from "./fetchData";

const switchButton = document.querySelector(".switch-input");
const cityInput = document.getElementById("location-input");
const magnifyingGlass = document.getElementById("magnifying");
export let city = "barcelona";


export function loadEventListeners() {

window.addEventListener("load", ()=> { 
        getWeather(city);
    getFutureWeather(city);})

magnifyingGlass.addEventListener("click", ()=> {
    console.log("glass clicked")
    getWeather(cityInput.value);
});

switchButton.addEventListener("click", ()=> {
 units = "farenheit";
 getWeather(city);
 getFutureWeather(city);
})
}



