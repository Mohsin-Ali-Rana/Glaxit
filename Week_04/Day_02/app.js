// Configuration
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// DOM Elements
const gridContainer = document.getElementById('user-grid');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

/**
 * Initializes the application by fetching and rendering users.
 */
function init() {
    // Promise State: PENDING (The request has started)
    fetch(API_URL)
        .then(response => {
            // Check if the HTTP status code is 200-299
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            // response.json() also returns a Promise, parsing the body text as JSON
            return response.json(); 
        })
        .then(usersData => {
            // Promise State: RESOLVED (Data successfully fetched and parsed)
            loadingElement.style.display = 'none';
            renderUsers(usersData);
        })
        .catch(error => {
            // Promise State: REJECTED (Network failure or thrown error)
            console.error("Fetch operation failed:", error);
            
            loadingElement.style.display = 'none';
            errorElement.style.display = 'block';
            errorElement.textContent = `Unable to load directory: ${error.message}`;
        });
}

/**
 * Maps over the user data array and injects HTML into the DOM.
 * @param {Array} users - Array of user objects from the API
 */
function renderUsers(users) {
    // Map data to HTML strings and join them into a single block
    const cardsHTML = users.map(user => {
        // Extract initials for the avatar
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        
        return `
            <article class="user-card">
                <div class="user-avatar">${initials}</div>
                <h2 class="user-name">${user.name}</h2>
                <p class="user-detail"><strong>@</strong> ${user.username}</p>
                <p class="user-detail"><strong>✉</strong> ${user.email}</p>
                <p class="user-detail"><strong>🏢</strong> ${user.company.name}</p>
            </article>
        `;
    }).join('');

    // Inject the generated HTML into our grid container
    gridContainer.innerHTML = cardsHTML;
}

// Start the app when the script loads
init();