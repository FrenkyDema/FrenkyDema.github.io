let repositories = [];

// Ensure DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Function to get language color
    function getLanguageColor(language) {
        const colors = {
            JavaScript: "#f1e05a",
            Python: "#3572A5",
            Dart: "#00B4AB",
            Java: "#b07219",
            // Add other colors if needed
        };
        return colors[language] || '#e74c3c'; // Default color
    }

    // Fetch repositories from GitHub
    function fetchRepositories() {
        console.log('Fetching repositories...');
        fetch('https://api.github.com/users/FrenkyDema/repos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Repositories fetched:', data);
                repositories = data;
                displayRepositories(repositories);
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                document.getElementById('repositories').innerHTML = '<p>Could not load repositories.</p>';
            });
    }

    // Function to display repositories
    function displayRepositories(repos) {
        const reposContainer = document.getElementById('repositories');
        if (repos.length === 0) {
            reposContainer.innerHTML = '<p>No repositories found.</p>';
            return;
        }

        reposContainer.innerHTML = repos.map(repo => `
            <div class="repository-card">
                <div class="repository-header">
                    <h3>${repo.name} ${repo.fork ? '<i class="fas fa-code-branch" title="Forked Repository"></i>' : ''}</h3>
                    <a href="${repo.html_url}" target="_blank">View</a>
                </div>
                <div class="repository-description">
                    ${repo.description || 'No description available.'}
                </div>
                <div class="repository-footer">
                    <div class="language">
                        <span class="language--color" style="background-color: ${getLanguageColor(repo.language)};"></span>
                        ${repo.language || 'Unknown'}
                    </div>
                    <div class="stars">
                        &#9733; ${repo.stargazers_count}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Function to filter repositories
    function filterRepositories() {
        console.log('Filtering repositories...');
        const languageFilter = document.getElementById('languageFilter').value;
        const starsFilter = parseInt(document.getElementById('starsFilter').value, 10);
        let filteredRepos = repositories;

        if (languageFilter !== 'all') {
            filteredRepos = filteredRepos.filter(repo => repo.language === languageFilter);
        }
        if (!isNaN(starsFilter) && starsFilter !== 'all') {
            filteredRepos = filteredRepos.filter(repo => repo.stargazers_count >= starsFilter);
        }

        displayRepositories(filteredRepos);
    }

    // Ensure elements exist before adding event listeners
    const filterIcon = document.querySelector('.filter-icon');
    const searchButton = document.querySelector('.search-button');

    if (filterIcon) {
        filterIcon.addEventListener('click', () => {
            console.log('Filter icon clicked');
            const filters = document.querySelector('.filters');
            if (filters) {
                filters.style.display = filters.style.display === 'none' || filters.style.display === '' ? 'flex' : 'none';
            }
        });
    } else {
        console.error('Filter icon not found');
    }

    if (searchButton) {
        searchButton.addEventListener('click', filterRepositories);
    } else {
        console.error('Search button not found');
    }

    // Initialize repository fetching on page load
    fetchRepositories();
});