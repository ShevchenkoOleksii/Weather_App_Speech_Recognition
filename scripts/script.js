var humidity,
    pressure,
    temperature,
    windSpeed,
    getWeatherButton = getElement('getWeather'),
    weatherSummary = getElement('weather-summary'),
    cityName = getElement('cityName'),
    getWeatherByCityName = getElement('getWeatherByCityName'),
    spinner,
    currentCity,
    url,
    urlCity,
    ul,
    urlCoords,
    ulCity,
    ulCoords,
    micro = getElement('micro');

function getElement(id) {
    return document.getElementById(id);
}

function getWeather() {
    if (this.name === 'by-coords') {
        humidity = getElement(`current-humidity-${this.name}`);
        pressure = getElement(`current-pressure-${this.name}`);
        temperature = getElement(`current-temperature-${this.name}`);
        windSpeed = getElement(`current-wind-speed-${this.name}`);
        spinner = document.querySelector(`.lds-spinner.${this.name}`);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                getWeatherData(position.coords.latitude, position.coords.longitude, null);
            })
        } else {
            return alert('Could not get current location');
        }
    } else if (this.name === 'by-city-name') {
        humidity = getElement(`current-humidity-${this.name}`);
        pressure = getElement(`current-pressure-${this.name}`);
        temperature = getElement(`current-temperature-${this.name}`);
        windSpeed = getElement(`current-wind-speed-${this.name}`);
        spinner = document.querySelector(`.lds-spinner.${this.name}`);
        currentCity = cityName.value;

        if (currentCity.trim() === '') {
            getWeatherByCityName.innerHTML = 'Get Weather';
            return;
        }

        getWeatherData(null, null, currentCity);
    }

    setTimeout(function () {
        getWeatherByCityName.innerHTML = 'Get Weather';
    }, 2000);
}

function getWeatherData(latitude, longitude, currentCity) {
    urlCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=08d1316ba8742c08076e7425c28c2614`;
    urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&units=metric&appid=e485dc44c23d86c2cda0e9ddda2f844f`;
    ulCity = document.getElementById('by-city-name');
    ulCoords = document.getElementById('by-coords');
    ul = currentCity ? ulCity : ulCoords;
    spinner.classList.toggle('hidden');
    ul.classList.toggle('hidden');
    url = currentCity ? urlCity : urlCoords;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayData(data);
        })
        .catch(function (error) {
            console.error(error);
            spinner.classList.toggle('hidden');
            ul.classList.toggle('hidden');
        })
}

function displayData(data) {
    temperature.innerHTML = `${(data.main.temp).toFixed(1)} &ordm;C`;
    humidity.innerHTML = `${data.main.humidity} %`;
    pressure.innerHTML = `${hPaToMmHg(data.main.pressure)} mmHg`;
    windSpeed.innerHTML = `${meterPerSecToKmPerHour(data.wind.speed).toFixed(1)} km/h`;
    spinner.classList.toggle('hidden');
    ul.classList.toggle('hidden');
}

function hPaToMmHg(P) {
    return P = (P * 0.750061683).toFixed(1);
}

getWeatherButton.addEventListener('click', getWeather);
getWeatherByCityName.addEventListener('click', getWeather);
cityName.addEventListener('change', changeButtonValue);

function changeButtonValue() {
    if (currentCity.trim() === '') {
        return;
    }
    getWeatherByCityName.innerHTML += ` in ${cityName.value}!`;
}

function meterPerSecToKmPerHour(metPerSec) {
    return metPerSec * 3.6;
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true;

micro.addEventListener('click', speechRec);

function speechRec() {
    recognition.addEventListener('result', function (event) {

        var resultValue = Array.from(event.results)
            .map(function (result) {
                return result[0];
            })
            .map(function (result) {
                return result.transcript
            })
            .join('');

        if (event.results[0].isFinal) {
            cityName.value = resultValue;
            this.name = 'by-city-name';
            humidity = getElement(`current-humidity-${this.name}`);
            pressure = getElement(`current-pressure-${this.name}`);
            temperature = getElement(`current-temperature-${this.name}`);
            windSpeed = getElement(`current-wind-speed-${this.name}`);
            spinner = document.querySelector(`.lds-spinner.${this.name}`);
            currentCity = cityName.value;

            getWeatherData(null, null, currentCity);
        }
    })

    recognition.start();
}

