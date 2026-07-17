const STORAGE_KEY = "favoriteQuotes";

export function getSavedQuotes() {

    try {

        const savedQuotes = localStorage.getItem(STORAGE_KEY);

        return savedQuotes ? JSON.parse(savedQuotes) : [];

    } catch (error) {

        console.error(error);

        return [];

    }

}

export function saveQuote(quote) {

    const savedQuotes = getSavedQuotes();

    const alreadySaved = savedQuotes.some((savedQuote) => savedQuote.id === quote.id);

    if (!alreadySaved) {

        savedQuotes.push(quote);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedQuotes));

    }

    return savedQuotes;

}