let repositoriesData = []; // Array to hold all fetched repositories
let filteredRepositoriesData = []; // Array to hold filtered repositories
let repoIndex = 0; // Index to track how many repositories are loaded at a time
const REPOS_PER_PAGE = 3;

/**
 * Fetches repositories from GitHub API and initializes the display.
 */
function fetchRepositories() {
  console.log("Starting fetch for repositories...");
  fetch("https://api.github.com/users/FrenkyDema/repos")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Network response was not ok. Status: " + response.status
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("Repositories fetched:", data);
      repositoriesData = data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      ); // Sort by most recent
      filteredRepositoriesData = [...repositoriesData]; // Initially, all repos are shown

      // Explicitly remove the "Loading repositories..." <p> element
      const reposContainer = document.getElementById("repositories");
      const loadingMessage = reposContainer.querySelector("p");
      if (loadingMessage) {
        reposContainer.removeChild(loadingMessage);
        console.log("Loading message removed.");
      }

      populateLanguageFilter(repositoriesData);
      setupFilterEventListeners();
      displayRepositories(); // Load the first set of repositories
    })
    .catch((error) => {
      document.getElementById("repositories").innerHTML =
        "<p>Could not load repositories. Please try again later.</p>";
      console.error("Error fetching repositories:", error);
    });
}

/**
 * Populates the language filter dropdown with unique languages from repos.
 * @param {Array} repos - The array of repository objects.
 */
function populateLanguageFilter(repos) {
  const languageFilter = document.getElementById("language-filter");
  if (!languageFilter) return;

  const languages = new Set(
    repos.map((repo) => repo.language).filter((lang) => lang)
  );
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    languageFilter.appendChild(option);
  });
}

/**
 * Sets up event listeners for the filter toggle and apply buttons.
 */
function setupFilterEventListeners() {
  const filterToggleBtn = document.getElementById("filter-toggle-btn");
  const filtersDropdown = document.getElementById("filters-dropdown");
  const applyFilterBtn = document.getElementById("apply-filter-btn");

  if (filterToggleBtn) {
    filterToggleBtn.addEventListener("click", () => {
      filtersDropdown.style.display =
        filtersDropdown.style.display === "flex" ? "none" : "flex";
    });
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", applyFilter);
  }
}

/**
 * Applies the selected language filter to the repository list.
 */
function applyFilter() {
  const languageFilter = document.getElementById("language-filter");
  const selectedLanguage = languageFilter.value;

  if (selectedLanguage === "") {
    filteredRepositoriesData = [...repositoriesData];
  } else {
    filteredRepositoriesData = repositoriesData.filter(
      (repo) => repo.language === selectedLanguage
    );
  }

  // Hide the dropdown after applying
  const filtersDropdown = document.getElementById("filters-dropdown");
  if (filtersDropdown) {
    filtersDropdown.style.display = "none";
  }

  displayRepositories(); // Re-display repos with the filter
}

/**
 * Clears and resets the repository list, then loads the first batch.
 */
function displayRepositories() {
  repoIndex = 0; // Reset index
  document.getElementById("repositories").innerHTML = ""; // Clear current repos

  const loadMoreBtn = document.getElementById("load-more-repos-btn");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = "inline-block"; // Show button
  }

  if (filteredRepositoriesData.length === 0) {
    document.getElementById("repositories").innerHTML =
      "<p>No repositories found matching the filter.</p>";
    if (loadMoreBtn) loadMoreBtn.style.display = "none"; // Hide button if no repos
  } else {
    loadMoreRepositories(); // Load first batch
  }
}

/**
 * Loads the next batch of repositories into the DOM.
 */
function loadMoreRepositories() {
  const reposContainer = document.getElementById("repositories");
  const nextIndex = repoIndex + REPOS_PER_PAGE;
  const reposToLoad = filteredRepositoriesData.slice(repoIndex, nextIndex);

  reposToLoad.forEach((repo) => {
    const repoElement = document.createElement("div");
    repoElement.classList.add("repository-card");

    // Updated innerHTML to include icons and better structure
    repoElement.innerHTML = `
            <div class="repository-header">
                <h3>${repo.name}</h3>
                <a href="${repo.html_url}" target="_blank">View</a>
            </div>
            <div class="repository-description">
                <p>${repo.description || "No description available."}</p>
            </div>
            <div class="repository-footer">
                <div class="language">
                    <i class="fas fa-circle"></i> ${repo.language || "Unknown"}
                </div>
                <div class="stars">
                    <i class="fas fa-star"></i> ${repo.stargazers_count}
                </div>
            </div>
        `;

    reposContainer.appendChild(repoElement);
    console.log(`Added repository to DOM: ${repo.name}`);
  });

  repoIndex = nextIndex;

  // Hide load more button if all repositories are loaded
  const loadMoreBtn = document.getElementById("load-more-repos-btn");
  if (loadMoreBtn && repoIndex >= filteredRepositoriesData.length) {
    loadMoreBtn.style.display = "none";
  } else if (loadMoreBtn) {
    // Scroll smoothly to the new repositories
    reposContainer.lastElementChild.scrollIntoView({ behavior: "smooth" });
  }
}

// Add event listener for the "Load More" button
const loadMoreBtn = document.getElementById("load-more-repos-btn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", loadMoreRepositories);
} else {
  // Wait for the element to be loaded
  document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("load-more-repos-btn")
      .addEventListener("click", loadMoreRepositories);
  });
}

// Initialize repositories on page load
fetchRepositories();
console.log("fetchRepositories function has been called.");
