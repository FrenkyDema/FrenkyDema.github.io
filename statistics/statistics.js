/**
 * Fetches GitHub statistics, calculates key metrics, and creates a language pie chart.
 */
function fetchAndDisplayStats() {
  fetch("https://api.github.com/users/FrenkyDema/repos")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((repos) => {
      calculateKeyMetrics(repos);
      createLanguageChart(repos);
    })
    .catch((error) => {
      const statsSection = document.getElementById("statistics-section");
      if (statsSection) {
        statsSection.innerHTML =
          "<h2>Statistics</h2><p>Could not load statistics.</p>";
      }
      console.error("Error loading statistics:", error);
    });
}

/**
 * Calculates and displays key metrics (Total Repos, Stars, Forks).
 * @param {Array} repos - The array of repository objects.
 */
function calculateKeyMetrics(repos) {
  const metricsContainer = document.getElementById("key-metrics");
  if (!metricsContainer) return;

  const totalRepos = repos.length;
  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0
  );
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

  metricsContainer.innerHTML = `
        <div class="metric-card">
            <i class="fas fa-book-bookmark"></i>
            <h4>${totalRepos}</h4>
            <p>Total Repositories</p>
        </div>
        <div class="metric-card">
            <i class="fas fa-star"></i>
            <h4>${totalStars}</h4>
            <p>Total Stars</p>
        </div>
        <div class="metric-card">
            <i class="fas fa-code-branch"></i>
            <h4>${totalForks}</h4>
            <p>Total Forks</p>
        </div>
    `;
}

/**
 * Creates the language distribution pie chart.
 * @param {Array} repos - The array of repository objects.
 */
function createLanguageChart(repos) {
  const languages = {};
  repos.forEach((repo) => {
    if (repo.language) {
      if (!languages[repo.language]) {
        languages[repo.language] = 0;
      }
      languages[repo.language]++;
    }
  });

  // Sort languages by count, descending
  const sortedLanguages = Object.entries(languages).sort(
    ([, countA], [, countB]) => countB - countA
  );

  const ctx = document.getElementById("languageChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: sortedLanguages.map(([lang]) => lang),
      datasets: [
        {
          data: sortedLanguages.map(([, count]) => count),
          backgroundColor: [
            "#1abc9c",
            "#3498db",
            "#9b59b6",
            "#e74c3c",
            "#f1c40f",
            "#e67e22",
            "#2ecc71",
          ],
          borderColor: "#34495e", // Match card background
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#ecf0f1", // Set legend text color
          },
        },
      },
    },
  });
}

fetchAndDisplayStats();
