// export function displayWeather(data) {
//     document.getElementById("cityName").textContent = data.name;
//     document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
//     document.getElementById("description").textContent = data.weather[0].description;
//     document.getElementById("humidity").textContent = `${data.main.humidity}%`;
//     document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
//     const icon = data.weather[0].icon;
//     document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
// }





export function displayWeather(data) {
    document.getElementById("cityName").textContent = `${data.city}, ${data.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.temperature)}°C`;
    document.getElementById("humidity").textContent = `${data.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind} km/h`;
    document.getElementById("description").textContent = getWeatherDescription(data.weatherCode);
    document.getElementById("weatherIcon").src = getWeatherIcon(data.weatherCode);
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        61: "Light Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        71: "Light Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        80: "Rain Showers",
        81: "Heavy Rain Showers",
        95: "Thunderstorm"
    };

    return weatherCodes[code] || "Unknown";
}

function getWeatherIcon(code) {
    if (code === 0)
        return "https://openweathermap.org/img/wn/01d@2x.png";

    if (code <= 3)
        return "https://openweathermap.org/img/wn/02d@2x.png";

    if (code <= 55)
        return "https://openweathermap.org/img/wn/50d@2x.png";

    if (code <= 65)
        return "https://openweathermap.org/img/wn/10d@2x.png";

    if (code <= 75)
        return "https://openweathermap.org/img/wn/13d@2x.png";

    if (code <= 82)
        return "https://openweathermap.org/img/wn/09d@2x.png";

    return "https://openweathermap.org/img/wn/11d@2x.png";
}

export function displayQuote(data) {
    document.getElementById("quoteText").textContent = `"${data.quote}"`;
    document.getElementById("quoteAuthor").textContent = `— ${data.author}`;
}

export function renderFavoriteQuotes(quotes) {
    const container = document.getElementById("favoritesContainer");

    if (!container) {
        return;
    }

    if (!quotes.length) {
        container.innerHTML = '<p class="empty">No saved quotes yet.</p>';
        return;
    }

    container.innerHTML = quotes
        .map((quote) => `
            <article class="favorite-quote">
                <blockquote>"${quote.quote}"</blockquote>
                <p>— ${quote.author}</p>
            </article>
        `)
        .join("");
}