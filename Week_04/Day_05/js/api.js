// const API_KEY = "your key";
// const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// export async function getWeather(city) {
//     try {
//         const response = await fetch(
//             `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
//         );

//         if (!response.ok) {
//             throw new Error("City not found");
//         }

//         const data = await response.json();
//         return data;

//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }







// ===============================
// Open-Meteo APIs
// ===============================
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// ===============================
// Get Weather by City
// ===============================
export async function getWeather(city) {
    try {
        // Step 1: Get Latitude & Longitude
        const geoResponse = await fetch(
            `${GEO_URL}?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Fetch Weather
        const weatherResponse = await fetch(
            `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        // Return everything needed by UI
        return {
            city: location.name,
            country: location.country,
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            wind: weatherData.current.wind_speed_10m,
            weatherCode: weatherData.current.weather_code
        };

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getRandomQuote() {
    try {
        const response = await fetch(
            "https://dummyjson.com/quotes/random"
        );

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        return null;
    }
}