let repositoriesData = [];
let filteredRepositoriesData = [];
let repoIndex = 0;
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
      );
      filteredRepositoriesData = [...repositoriesData];

      const reposContainer = document.getElementById("repositories");
      const loadingMessage = reposContainer.querySelector("p");
      if (loadingMessage) {
        reposContainer.removeChild(loadingMessage);
        console.log("Loading message removed.");
      }

      populateLanguageFilter(repositoriesData);
      setupFilterEventListeners();
      displayRepositories();
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

  const filtersDropdown = document.getElementById("filters-dropdown");
  if (filtersDropdown) {
    filtersDropdown.style.display = "none";
  }

  displayRepositories();
}

/**
 * Clears and resets the repository list, then loads the first batch.
 */
function displayRepositories() {
  repoIndex = 0;
  document.getElementById("repositories").innerHTML = "";

  const loadMoreBtn = document.getElementById("load-more-repos-btn");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = "inline-block";
  }

  if (filteredRepositoriesData.length === 0) {
    document.getElementById("repositories").innerHTML =
      "<p>No repositories found matching the filter.</p>";
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
  } else {
    loadMoreRepositories();
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

  const loadMoreBtn = document.getElementById("load-more-repos-btn");
  if (loadMoreBtn && repoIndex >= filteredRepositoriesData.length) {
    loadMoreBtn.style.display = "none";
  } else if (loadMoreBtn) {
    reposContainer.lastElementChild.scrollIntoView({ behavior: "smooth" });
  }
}

const loadMoreBtnGlobal = document.getElementById("load-more-repos-btn");
if (loadMoreBtnGlobal) {
  loadMoreBtnGlobal.addEventListener("click", loadMoreRepositories);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("load-more-repos-btn")
      .addEventListener("click", loadMoreRepositories);
  });
}

fetchRepositories();
console.log("fetchRepositories function has been called.");
