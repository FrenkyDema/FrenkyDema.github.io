let repositoriesData = []; // Array to hold fetched repositories
let repoIndex = 0; // Index to track how many repositories are loaded at a time

// Fetch repositories from GitHub API
function fetchRepositories() {
    console.log('Starting fetch for repositories...');
    fetch('https://api.github.com/users/FrenkyDema/repos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Repositories fetched:', data);
            repositoriesData = data;

            // Explicitly remove the "Loading repositories..." <p> element
            const reposContainer = document.getElementById('repositories');
            const loadingMessage = reposContainer.querySelector('p');
            if (loadingMessage) {
                reposContainer.removeChild(loadingMessage);
                console.log('Loading message removed.');
            }

            loadMoreRepositories(); // Load the first set of repositories
        })
        .catch(error => {
            document.getElementById('repositories').innerHTML = '<p>Could not load repositories. Please try again later.</p>';
            console.error('Error fetching repositories:', error);
        });
}

function loadMoreRepositories() {
    const reposContainer = document.getElementById('repositories');
    const nextIndex = repoIndex + 3; // Load 3 repositories at a time
    const reposToLoad = repositoriesData.slice(repoIndex, nextIndex);

    reposToLoad.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('repository-card');

        repoElement.innerHTML = `
            <div class="repository-header">
                <h3>${repo.name}</h3>
                <a href="${repo.html_url}" target="_blank">View</a>
            </div>
            <div class="repository-description">
                ${repo.description || 'No description available.'}
            </div>
            <div class="repository-footer">
                <div class="language">
                    ${repo.language || 'Unknown'}
                </div>
                <div class="stars">
                    &#9733; ${repo.stargazers_count}
                </div>
            </div>
        `;

        // Append the item to the repository container
        reposContainer.appendChild(repoElement);
        console.log(`Added repository to DOM: ${repo.name}`);
    });

    repoIndex = nextIndex;

    // Hide load more button if all repositories are loaded
    if (repoIndex >= repositoriesData.length) {
        document.getElementById('load-more-btn').style.display = 'none';
    } else {
        // Scroll smoothly to the new repositories
        reposContainer.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
}

document.getElementById('load-more-btn').addEventListener('click', loadMoreRepositories);

// Initialize repositories on page load
fetchRepositories();
console.log('fetchRepositories function has been called.');