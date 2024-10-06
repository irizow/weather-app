import { forecastType, units } from "./pageLoad";
import { getFutureWeather } from "./fetchData";

const switchButton = document.querySelector(".switch-input");
const cityInput = document.getElementById("location-input");
const magnifyingGlass = document.getElementById("magnifying");
const hourlyButton = document.getElementById("hourly-button");
const dailyButton = document.getElementById("daily-button");
export let city = "barcelona";

export function loadEventListeners() {
  window.addEventListener("load", () => {
    getFutureWeather(city);
  });

  magnifyingGlass.addEventListener("click", () => {
    console.log("glass clicked");
    city = cityInput.value;
    getFutureWeather(city);

    return city;
  });

  switchButton.addEventListener("click", () => {
    units = "fahrenheit";
    getFutureWeather(city);
  });

  hourlyButton.addEventListener("click", () => {
    if (forecastType === "daily") {
      forecastType = "hourly";
      hourlyButton.classList.add("active");
      dailyButton.classList.remove("active");
      getFutureWeather(city);
    }
  });

  dailyButton.addEventListener("click", () => {
    if (forecastType === "hourly") {
      forecastType = "daily";
      dailyButton.classList.add("active");
      hourlyButton.classList.remove("active");
      getFutureWeather(city);
    }
  });
}



