document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Function to fetch repositories from GitHub
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
                console.log('Repositories fetched successfully:', data);

                if (data && data.length > 0) {
                    displayRepositories(data);
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

    // Function to display repositories
    function displayRepositories(repos) {
        const reposContainer = document.getElementById('repositories');
        if (!reposContainer) {
            console.error('Element with ID "repositories" not found.');
            return;
        }

        // Clear previous content
        reposContainer.innerHTML = '';

        reposContainer.innerHTML = repos.map(repo => `
            <div>
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <p>Language: ${repo.language || 'Unknown'}</p>
                <p>Stars: ${repo.stargazers_count}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            </div>
        `).join('');

        console.log('Updated repositories container innerHTML:', reposContainer.innerHTML);
    }

    // Call the function to fetch and display repositories
    fetchRepositories();
});