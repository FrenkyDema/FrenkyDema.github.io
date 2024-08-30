let updateData = []; // Array to hold fetched updates
let updateIndex = 0; // Index to track how many updates are loaded at a time

// Fetch latest updates from GitHub API
function fetchUpdates() {
    fetch('https://api.github.com/users/FrenkyDema/events')
    .then(response => response.json())
    .then(data => {
        updateData = data;
        loadMoreUpdates(); // Load the first set of updates
    })
    .catch(error => {
        document.getElementById('update-list').innerHTML = '<p>Could not load updates.</p>';
    });
}

function loadMoreUpdates() {
    const updatesContainer = document.getElementById('update-list');
    const nextIndex = updateIndex + 3; // Load 3 updates at a time
    const updatesToLoad = updateData.slice(updateIndex, nextIndex);

    updatesToLoad.forEach(event => {
        const updateCard = document.createElement('div');
        updateCard.classList.add('update-card');
        updateCard.innerHTML = `
            <h3>${event.repo.name}</h3>
            <p>${event.type.replace('Event', '')} - ${event.payload.commits ? event.payload.commits[0].message : 'No detailed description available.'}</p>
            <div class="meta">${new Date(event.created_at).toLocaleDateString()} at ${new Date(event.created_at).toLocaleTimeString()}</div>
        `;
        updatesContainer.appendChild(updateCard);
    });

    updateIndex = nextIndex;

    // Hide load more button if all updates are loaded
    if (updateIndex >= updateData.length) {
        document.getElementById('load-more-btn').style.display = 'none';
    }
}

document.getElementById('load-more-btn').addEventListener('click', loadMoreUpdates);

// Initialize updates on page load
fetchUpdates();