document.addEventListener('DOMContentLoaded', function() {
    console.log('repositories.js script is running.');

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
                    console.log('Data retrieved from API:', data);
                    displayRepositories(data);
                } else {
                    console.log('No repositories found in the data.');
                    document.getElementById('repositories').innerHTML = '<p>No repositories found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                document.getElementById('repositories').innerHTML = '<p>Could not load repositories. Please try again later.</p>';
            });
    }

    function displayRepositories(repos) {
        const reposContainer = document.getElementById('repositories');
        if (!reposContainer) {
            console.error('Element with ID "repositories" not found.');
            return;
        }

        console.log('Updating repositories section with fetched data...');
        reposContainer.innerHTML = ''; // Clear previous content

        repos.forEach(repo => {
            console.log('Processing repository:', repo.name);
            const repoElement = document.createElement('div');
            repoElement.className = 'repository-card';
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
            reposContainer.appendChild(repoElement);
            console.log(`Added repository to DOM: ${repo.name}`);
        });

        console.log('Repositories displayed successfully.');
    }

    fetchRepositories();
});