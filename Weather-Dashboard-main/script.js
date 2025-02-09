// Variables selected from HTML
const city = document.querySelector("#search");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn")
const mainWeather = document.querySelector(".main-weather")
const weatherDiv = document.querySelector(".weather-cards")

const API_KEY = "d863817a4e52dc948252db55663ba950"; // API KEY

// Function for Weather Cards to show on web page
function createWeatherCards(cityName, weatherItem, index) {
  // Current Weather
  if(index === 0){
    return ` 
    <div class="image">
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Weather icon">
    </div>
    <h1>${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h1>
    <h3 class="description">${weatherItem.weather[0].description}</h3>
    <hr>
    <div class="weather-information">
        <h4 id="feels-like">${(weatherItem.main.feels_like - 273.15).toFixed(2)}°C</h4>
        <h4 id="wind">${weatherItem.wind.speed} M/S</h4>
        <h4 id="humidity">${weatherItem.main.humidity}%</h4>
      </div>

      <h2 class="city">${cityName}</h2>
      <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>`
  }
  // 5 Days Forecast
  else{
    return `
      <div class= "cards">
      <ul>
      <li>${weatherItem.dt_txt.split(" ")[0]}</li>
      <li><img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather icon"></li>
      <li>Temprature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</li>
      <li>Wind: ${weatherItem.wind.speed} M/S</li>
      <li>Humidity: ${weatherItem.main.humidity}%</li>
  </ul>
  </div>
      `;

  }
}

// Function for getting weather details
function getWeatherDetails(cityName, lon, lat) {
  const WEATHER_URL = `https:${window.location.protocol === 'https:' ? '' : '//'}api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueDaysForecast = [];

      const forecastDays = data.list.filter((forecast) => {
        const newForecast = new Date(forecast.dt_txt).getDate();
        if (!uniqueDaysForecast.includes(newForecast)) {
          return uniqueDaysForecast.push(newForecast);
        }
      });

      // Clear Html for new details
      weatherDiv.innerHTML = " ";
      mainWeather.innerHTML = " ";

      forecastDays.forEach((weatherItem, index) => {
        const html = createWeatherCards(cityName, weatherItem, index)

        if(index === 0){
          mainWeather.insertAdjacentHTML("beforeend", html)

        }else{
          weatherDiv.insertAdjacentHTML("beforeend", html)

        }
      });
    })
    .catch(() => {
      alert("An error occured while fetching the weather details!");
    });
}

// Function for getting coordinates of City name given by user
function getCoordinates() {
  const cityName = city.value.trim();
  if (!cityName) return;
  const GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) alert(`No coordinates found for ${cityName}`);
      const { name, lon, lat } = data[0];
      getWeatherDetails(name, lon, lat);
    })
    .catch(() => {
      alert("An error occured while fetcing the coordinates!");
    });
}

// Function for show weather details on user's current location
function getUserCoordinates(){
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords

      const URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      const { name } = data[0];
      getWeatherDetails(name, longitude, latitude);
    })
    .catch(() => {
      alert("An error occured while fetcing the city name!");
    });
    },
    error => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("Geolocation request denied. Please reset location permission to grant access again.");
    } else {
        alert("Geolocation request error. Please reset location permission.");
    }
    }
  )
}

// Event Listners
locationButton.addEventListener("click", getUserCoordinates)
searchButton.addEventListener("click", getCoordinates);
city.addEventListener("keydown", (e) => {
  if(e.key === "Enter" || e.keyCode === 13){
    getCoordinates()
  }
})

// Default Weather details 
getWeatherDetails("Karachi", 66.990501, 24.860966)
