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

// Fetch statistics using GitHub API and create chart for language usage
fetch('https://api.github.com/users/FrenkyDema/repos')
    .then(response => response.json())
    .then(repos => {
        const languages = {};
        const starsPerLanguage = {};
        repos.forEach(repo => {
            const lang = repo.language || 'Unknown';
            if (lang) {
                if (!languages[lang]) {
                    languages[lang] = 0;
                }
                languages[lang]++;
                if (!starsPerLanguage[lang]) {
                    starsPerLanguage[lang] = 0;
                }
                starsPerLanguage[lang] += repo.stargazers_count;
            }
        });

        const ctx = document.getElementById('languageChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(languages),
                datasets: [{
                    data: Object.values(languages),
                    backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f'],
                    borderColor: '#2c3e50',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                },
            }
        });

        const ctxStars = document.getElementById('starsChart').getContext('2d');
        new Chart(ctxStars, {
            type: 'bar',
            data: {
                labels: Object.keys(starsPerLanguage),
                datasets: [{
                    label: 'Stars per Language',
                    data: Object.values(starsPerLanguage),
                    backgroundColor: ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c'],
                    borderColor: '#2c3e50',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                },
            }
        });
    })
    .catch(error => {
        document.getElementById('stats').innerHTML = '<p>Could not load statistics.</p>';
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