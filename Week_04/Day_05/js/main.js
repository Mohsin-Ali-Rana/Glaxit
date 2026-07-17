import { getWeather, getRandomQuote } from "./api.js";
import { displayWeather, displayQuote, renderFavoriteQuotes } from "./ui.js";
import { getSavedQuotes, saveQuote } from "./storage.js";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const saveQuoteBtn = document.getElementById("saveQuoteBtn");

let currentQuote = null;

renderFavoriteQuotes(getSavedQuotes());

// Weather Search Logic
searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city.");
        return;
    }

    const weather = await getWeather(city);

    if (weather) {
        displayWeather(weather);
    } else {
        alert("City not found.");
    }
});

// Quote Logic
async function loadQuote() {
    const quote = await getRandomQuote();

    if (quote) {
        currentQuote = quote;
        displayQuote(quote);
    }
}

newQuoteBtn.addEventListener("click", loadQuote);

saveQuoteBtn.addEventListener("click", () => {
    if (!currentQuote) {
        alert("Please load a quote first.");
        return;
    }

    const savedQuotes = saveQuote(currentQuote);
    renderFavoriteQuotes(savedQuotes);
});

// Initial quote load on page start
loadQuote();