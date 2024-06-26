const APIKey = "f004268a18ec7830138895b0e31a3214";
const searchButton = $(".search-button");
const searchInput = $(".search-input");
const forecastCardsDiv = $(".forecast-cards");
const mainWeatherDiv = $(".main-weather-details");
const form = $("form");
const historyButtons = $("#search-history");

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []; //saving search history to local storage array (or starting a blank one if there is none)

function getMainWeather(city) {
  //getting weather for main header card
  const cityURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

  if (city === "") {
    // If there is no input, alert and stop the function
    alert("Please enter a city name.");
    return;
  }

  fetch(cityURL) //fetching API response
    .then((response) => response.json())
    .then((data) => {
      console.log(data); //logging the API response

      mainWeatherDiv.empty(); //clearing out existing data from the div

      //populating the main weather card
      const mainWeatherHTML = ` 
        <h2>${data.name}</h2>
        <h4>Temperature: ${data.main.temp}°C</h4>
        <h4>Wind: ${data.wind.speed} km/h</h4>
        <h4>Humidity: ${data.main.humidity}%</h4>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="weather-icon">`;

      mainWeatherDiv.append(mainWeatherHTML); //appending to the HTML

      saveToSearchHistory(city); //saving to the search history

      // After fetching main weather, get lat and long data for forecast weather
      getForecastWeather(data.coord.lat, data.coord.lon);
    });
}

function getForecastWeather(lat, lon) {
  //getting forecast weather for cards
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

  fetch(forecastURL) //calling API utilising lat and lon data from above
    .then((response) => response.json())
    .then((data) => {
      console.log(data); //logging this data

      forecastCardsDiv.empty(); //emptying cards of existing data

      const filterDates = data.list.filter((forecast) => {
        //filtering dates to only show information featuring '15:00:00', so once per day
        return forecast.dt_txt.includes("15:00:00");
      });

      // Display multiple forecast cards
      filterDates.slice(0, 5).forEach((forecast) => {
        const forecastDate = new Date(forecast.dt_txt);
        //pushing cards to HTML and converting the date to a string to be read
        const forecastCardHTML = `
          <div class="forecast-card">
            <h3>${forecastDate.toLocaleDateString()}</h3> 
            <p>Temperature: ${forecast.main.temp}°C</p>
            <p>Wind: ${forecast.wind.speed} km/h</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
            <img src="https://openweathermap.org/img/wn/${
              forecast.weather[0].icon
            }.png" alt="weather-icon">
          </div>`;
        forecastCardsDiv.append(forecastCardHTML); //appending the HTML
      });
    });
}

function saveToSearchHistory(city) {
  // Add city to search history
  searchHistory.push(city);

  // Save search history array to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  pushSearchHistory();
}

function pushSearchHistory() {
  //pushing the search history to buttons
  historyButtons.empty(); //clearing existing button data

  searchHistory.forEach((city) => {
    //pushing search history array to buttons, using city name
    const $button = $(
      `<button type='button' class='btn btn-secondary'></button>`
    ) //definig the button
      .text(city) //telling the text to be city
      .click(() => {
        //saying on click perform getMainWeather function using this city
        getMainWeather(city);
      });
    historyButtons.append($button); //appending the buttons to the HTML
  });
}

pushSearchHistory();

// Submit event listener for the form
form.on("submit", function (event) {
  event.preventDefault();

  //defining that city is the input value from the form
  let city = searchInput.val();
  getMainWeather(city); //pushing that to the getMainWeather function
});
