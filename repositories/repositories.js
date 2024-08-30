let repositories = [];

// Ensure DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    // Funzione per prendere il colore della lingua
    function getLanguageColor(language) {
        const colors = {
            JavaScript: "#f1e05a",
            Python: "#3572A5",
            Dart: "#00B4AB",
            Java: "#b07219",
            // Aggiungi altri colori se necessario
        };
        return colors[language] || '#e74c3c'; // Default color
    }

    // Fetch delle repository da GitHub
    function fetchRepositories() {
        fetch('https://api.github.com/users/FrenkyDema/repos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                repositories = data;
                displayRepositories(repositories);
            })
            .catch(error => {
                console.error('Errore durante il fetch delle repository:', error);
                document.getElementById('repositories').innerHTML = '<p>Could not load repositories.</p>';
            });
    }

    // Funzione per mostrare le repository
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

    // Funzione per filtrare le repository
    function filterRepositories() {
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

    // Assicurati che gli elementi esistano prima di aggiungere gli event listener
    const filterIcon = document.querySelector('.filter-icon');
    const searchButton = document.querySelector('.search-button');

    if (filterIcon) {
        filterIcon.addEventListener('click', () => {
            const filters = document.querySelector('.filters');
            filters.style.display = filters.style.display === 'none' || filters.style.display === '' ? 'flex' : 'none';
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', filterRepositories);
    }

    // Inizializzazione al caricamento della pagina
    fetchRepositories();
});