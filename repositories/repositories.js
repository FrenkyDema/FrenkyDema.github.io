// Fetch repositories and display them in reverse order
fetch('https://api.github.com/users/FrenkyDema/repos')
    .then(response => response.json())
    .then(repos => {
        const reposContainer = document.getElementById('repositories');
        repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by creation date
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
    })
    .catch(error => {
        document.getElementById('repositories').innerHTML = '<p>Could not load repositories.</p>';
    });

function getLanguageColor(language) {
    const colors = {
        "JavaScript": "#f1e05a",
        "Python": "#3572A5",
        "Java": "#b07219",
        "HTML": "#e34c26",
        "CSS": "#563d7c",
        "C++": "#f34b7d",
    };
    return colors[language] || '#e74c3c';
}