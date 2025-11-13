// Fetch statistics using GitHub API and create chart
fetch("https://api.github.com/users/FrenkyDema/repos")
  .then((response) => response.json())
  .then((repos) => {
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
            borderColor: "#2c3e50",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#ecf0f1", // Set legend text color to be visible
            },
          },
        },
      },
    });
  })
  .catch((error) => {
    const statsSection = document.getElementById("statistics-section");
    if (statsSection) {
      statsSection.innerHTML =
        "<h2>Statistics</h2><p>Could not load statistics.</p>";
    }
    console.error("Error loading statistics:", error);
  });
