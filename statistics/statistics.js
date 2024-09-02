// Fetch statistics using GitHub API and create chart
fetch('https://api.github.com/users/FrenkyDema/repos')
    .then(response => response.json())
    .then(repos => {
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                if (!languages[repo.language]) {
                    languages[repo.language] = 0;
                }
                languages[repo.language]++;
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
    })
    .catch(error => {
        document.getElementById('stats').innerHTML = '<p>Could not load statistics.</p>';
    });