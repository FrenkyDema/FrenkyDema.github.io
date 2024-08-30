document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch repositories from GitHub
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
    fetchRepositories();
});