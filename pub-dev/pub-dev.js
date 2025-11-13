/**
 * A list of your package names as they appear on pub.dev.
 * !! IMPORTANT: You must update this list manually.
 */
const MY_PACKAGES = ["sunmi_scanner", "valorant_translator"];

/**
 * Fetches data for all packages from the pub.dev API and displays them.
 */
function fetchPubDevPackages() {
  const packageListContainer = document.getElementById("pub-package-list");
  if (!packageListContainer) {
    console.error("Pub.dev package list container not found");
    return;
  }

  // Create a fetch promise for each package
  const fetchPromises = MY_PACKAGES.map((pkgName) => {
    return fetch(`https://pub.dev/api/packages/${pkgName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Package not found: ${pkgName}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
        return null; // Return null on error so Promise.all doesn't fail
      });
  });

  // When all fetches are complete
  Promise.all(fetchPromises).then((allPackageData) => {
    // Filter out any packages that failed to load
    const validPackages = allPackageData.filter((pkg) => pkg !== null);

    if (validPackages.length === 0) {
      packageListContainer.innerHTML =
        "<p>Could not load any pub.dev packages.</p>";
      return;
    }

    // Clear "Loading..." message
    packageListContainer.innerHTML = "";

    // Sort packages by popularity
    validPackages.sort(
      (a, b) =>
        (b.score?.popularityScore || 0) - (a.score?.popularityScore || 0)
    );

    // Create and append a card for each package
    validPackages.forEach((pkg) => {
      const card = createPackageCard(pkg);
      packageListContainer.appendChild(card);
    });
  });
}

/**
 * Creates an HTML element for a single pub.dev package card.
 * @param {object} pkg - The package data from pub.dev API.
 * @returns {HTMLElement} A div element representing the package card.
 */
function createPackageCard(pkg) {
  const card = document.createElement("div");
  card.classList.add("pub-package-card");

  const latest = pkg.latest;
  const score = pkg.score || {
    likeCount: 0,
    popularityScore: 0,
    grantedPoints: 0,
  };
  const maxPoints = 140; // As of pub.dev's current max score

  // Convert scores to percentages
  const popularity = Math.round((score.popularityScore || 0) * 100);
  const pubPoints = score.grantedPoints || 0;

  card.innerHTML = `
        <div class="pub-package-header">
            <h3>${latest.pubspec.name}</h3>
            <span class="version">v${latest.version}</span>
        </div>
        <div class="pub-package-description">
            <p>${latest.pubspec.description || "No description available."}</p>
        </div>
        <div class="pub-package-footer">
            <div class="stat">
                <i class="fas fa-heart"></i>
                <strong>${score.likeCount}</strong>
                <span>Likes</span>
            </div>
            <div class="stat">
                <i class="fas fa-certificate"></i>
                <strong>${pubPoints}/${maxPoints}</strong>
                <span>Pub Points</span>
            </div>
            <div class="stat">
                <i class="fas fa-chart-line"></i>
                <strong>${popularity}%</strong>
                <span>Popularity</span>
            </div>
        </div>
    `;

  // Make the whole card clickable
  card.addEventListener("click", () => {
    window.open(latest.package_url, "_blank");
  });
  card.style.cursor = "pointer";

  return card;
}

// Start fetching the packages
fetchPubDevPackages();
