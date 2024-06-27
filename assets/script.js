const APIKey = "f004268a18ec7830138895b0e31a3214";
const searchInput = $('.search-input');
const searchForm = $('form');
const mainWeatherDetails = $('.main-weather-details');
const forecastCardsDiv = $(".forecast-cards");
const historyButtons = $("#search-history");

let searchHistory = JSON.parse(localStorage.getItem ("searchHistory")) || [];

searchForm.on('submit', function(event) {
    event.preventDefault();

    let city = searchInput.val();
    mainWeather(city);
});

function mainWeather(city) {
    const mainWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

    fetch(mainWeatherAPI)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);

    mainWeatherDetails.empty();

    const mainWeatherHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <h4>Temperature: ${data.main.temp}°C</h4>
        <h4>Wind: ${data.wind.speed} km/h</h4>
        <h4>Humidity: ${data.main.humidity}%</h4>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="weather-icon">`;

    mainWeatherDetails.append(mainWeatherHTML);

    saveToSearchHistory(city);

    getForecastWeather(data.coord.lat, data.coord.lon);
});
}

function getForecastWeather(lat, lon) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

    fetch(forecastURL)
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    

    forecastCardsDiv.empty();

    const filterDates = data.list.filter(function(forecast) {
        return forecast.dt_txt.includes("15:00:00");
    });

    filterDates.slice(0, 6).forEach(function(forecast) {
        const forecastDate = new Date(forecast.dt_txt);
    

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

        forecastCardsDiv.append(forecastCardHTML);
    });
    });
}

function saveToSearchHistory(city) {
    searchHistory.push(city);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    pushSearchHistory();
}

function pushSearchHistory() {
    historyButtons.empty();

    searchHistory.forEach(function(city) {
        const $button = $(`<button type='button' class='btn btn-secondary'></button>`)
        .text(city)
        .click(function() {
            mainWeather(city);
        });
        historyButtons.append($button);
    });
}
