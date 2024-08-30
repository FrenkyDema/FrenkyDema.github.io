function displayRepositories(repos) {
    const reposContainer = document.getElementById('repositories');
    console.log('Displaying repositories:', repos);

    if (!reposContainer) {
        console.error('No element with ID "repositories" found in the DOM.');
        return;
    }

    if (!repos || repos.length === 0) {
        reposContainer.innerHTML = '<p>No repositories found.</p>';
        return;
    }

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