const API_URL = 'https://jsonplaceholder.typicode.com/users';

const gridContainer = document.getElementById('user-grid');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

/**
 * Initializes the app and fetches user data.
 * Currently configured to simulate a failed request for testing the fallback UI.
 */
async function init() {
    try {
        // Intentionally hitting a broken endpoint to test error handling
        const brokenUrl = 'https://jsonplaceholder.typicode.com/invalid-users-url';
        const response = await fetch(brokenUrl);
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const usersData = await response.json(); 
        
        loadingElement.style.display = 'none';
        renderUsers(usersData);
    } catch (error) {
        console.error("Fetch operation failed:", error);
        
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        
        errorElement.innerHTML = `
            <div style="text-align: center; padding: 30px; border: 1px solid #f5c6cb; border-radius: 8px; background-color: #f8dbdf; color: #721c24; max-width: 400px; margin: 0 auto;">
                <h2 style="margin-top: 0;">Oops! Something went wrong.</h2>
                <p>We couldn't load the user directory because the connection failed.</p>
                <p style="font-size: 0.9em; margin-bottom: 20px;"><i>Error details: ${error.message}</i></p>
                <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1em; transition: background-color 0.2s;">
                    Try Again
                </button>
            </div>
        `;
    }
}

/**
 * Renders the fetched user data into HTML cards.
 * @param {Array} users - Array of user objects
 */
function renderUsers(users) {
    const cardsHTML = users.map(user => {
        // Extract up to 2 initials from the user's name (e.g., "Leanne Graham" -> "LG")
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

    gridContainer.innerHTML = cardsHTML;
}

init();