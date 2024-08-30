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