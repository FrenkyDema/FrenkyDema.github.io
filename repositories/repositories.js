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

document.getElementById('languageFilter').addEventListener('change', filterRepositories);
document.getElementById('starsFilter').addEventListener('change', filterRepositories);

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

// Initialize repositories on page load
fetchRepositories();