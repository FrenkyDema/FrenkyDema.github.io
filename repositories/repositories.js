let repositories = [];

function fetchRepositories() {
    fetch('https://api.github.com/users/FrenkyDema/repos')
        .then(response => response.json())
        .then(data => {
            repositories = data;
            displayRepositories(repositories);
        })
        .catch(error => {
            document.getElementById('repositories').innerHTML = '<p>Could not load repositories.</p>';
        });
}

function displayRepositories(repos) {
    const reposContainer = document.getElementById('repositories');
    
    // Handle empty repository list case
    if (repos.length === 0) {
        reposContainer.innerHTML = '<p>No repositories found.</p>';
        return;
    }
    
    reposContainer.innerHTML = repos.map(repo => {
        return `
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
            </div>`;
    }).join('');
}

function filterRepositories() {
    const languageFilter = document.getElementById('languageFilter').value;
    const starsFilter = parseInt(document.getElementById('starsFilter').value, 10);
    let filteredRepos = repositories;

    if (languageFilter !== 'all') {
        filteredRepos = filteredRepos.filter(repo => repo.language === languageFilter);
    }
    if (starsFilter && starsFilter !== 'all') {
        filteredRepos = filteredRepos.filter(repo => repo.stargazers_count >= starsFilter);
    }

    displayRepositories(filteredRepos);
}

// Toggle filter visibility
document.querySelector('.filter-button').addEventListener('click', () => {
    const filters = document.querySelector('.filters');
    filters.style.display = filters.style.display === 'none' || filters.style.display === '' ? 'flex' : 'none';
});

document.querySelector('.search-button').addEventListener('click', filterRepositories);

// Initialize repositories on page load
fetchRepositories();