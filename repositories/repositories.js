// Log at the start of the script to confirm it is being loaded
console.log('repositories.js script is loaded.');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Function to get language color
    function getLanguageColor(language) {
        console.log('Determining color for language:', language);
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
        console.log('Starting fetch for repositories...');
        fetch('https://api.github.com/users/FrenkyDema/repos')
            .then(response => {
                console.log('Fetch response received:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Repositories fetched successfully:', data);
                if (data && data.length > 0) {
                    console.log('Repositories data:', data);
                    document.getElementById('repositories').innerHTML = data.map(repo => `
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
                                    ${repo.language || 'Unknown'}
                                </div>
                                <div class="stars">
                                    &#9733; ${repo.stargazers_count}
                                </div>
                            </div>
                        </div>
                    `).join('');
                } else {
                    console.log('No repositories found');
                    document.getElementById('repositories').innerHTML = '<p>No repositories found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                document.getElementById('repositories').innerHTML = `
                    <p>Could not load repositories. Please try again later.</p>`;
            });
    }

    // Call the function to fetch and display repositories
    console.log('Calling fetchRepositories...');
    fetchRepositories();
});

console.log('repositories.js script execution complete.');