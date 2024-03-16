import { getFutureWeather, getWeather } from "./fetchData";
import { createWeatherCard } from "./pageLoad";
import { loadEventListeners } from "./DOMEventListeners";
import { city } from "./DOMEventListeners";
import { getUserLocation } from "./fetchData";


loadEventListeners();
getUserLocation();

