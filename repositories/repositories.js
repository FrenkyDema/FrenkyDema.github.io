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
        console.log('Displaying repositories:', repos);

        if (!repos || repos.length === 0) {
            reposContainer.innerHTML = '<p>No repositories found.</p>';
            return;
        }

        // Basic rendering of repository names to isolate the issue
        reposContainer.innerHTML = repos.map(repo => `
            <div>
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <p>Language: ${repo.language || 'Unknown'}</p>
                <p>Stars: ${repo.stargazers_count}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            </div>
        `).join('');
    }

    // Call the function to fetch and display repositories
    console.log('Calling fetchRepositories...');
    fetchRepositories();
});

console.log('repositories.js script execution complete.');