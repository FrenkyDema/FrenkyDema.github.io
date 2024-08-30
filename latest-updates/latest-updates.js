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
            document.getElementById('timeline').innerHTML = '<p>Could not load updates.</p>';
        });
}

function loadMoreUpdates() {
    const timelineContainer = document.getElementById('timeline');
    const nextIndex = updateIndex + 3; // Load 3 updates at a time
    const updatesToLoad = updateData.slice(updateIndex, nextIndex);

    updatesToLoad.forEach(event => {
        const timelineItem = document.createElement('div');
        timelineItem.classList.add('timeline-item');

        // Choose an appropriate icon based on event type
        let iconClass = 'fa-code-branch'; // Default icon
        if (event.type.includes('Push')) {
            iconClass = 'fa-upload';
        } else if (event.type.includes('PullRequest')) {
            iconClass = 'fa-code-pull-request';
        } else if (event.type.includes('Issue')) {
            iconClass = 'fa-exclamation-circle';
        } else if (event.type.includes('Create')) {
            iconClass = 'fa-plus-circle';
        }

        timelineItem.innerHTML = `
            <div class="timeline-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="timeline-content">
                <h3>${event.repo.name}</h3>
                <p>${event.type.replace('Event', '')} - ${event.payload.commits ? event.payload.commits[0].message : 'No detailed description available.'}</p>
                <span class="timeline-date">${new Date(event.created_at).toLocaleDateString()} at ${new Date(event.created_at).toLocaleTimeString()}</span>
            </div>
        `;

        // Append the item to the timeline
        timelineContainer.appendChild(timelineItem);
    });

    updateIndex = nextIndex;

    // Hide load more button if all updates are loaded
    if (updateIndex >= updateData.length) {
        document.getElementById('load-more-btn').style.display = 'none';
    } else {
        // Scroll smoothly to the new updates
        timelineContainer.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
}

document.getElementById('load-more-btn').addEventListener('click', loadMoreUpdates);

// Initialize updates on page load
fetchUpdates();