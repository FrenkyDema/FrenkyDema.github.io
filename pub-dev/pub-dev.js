/**
 * A proxy URL to bypass CORS restrictions.
 * We use corsproxy.io which passes the response directly.
 */
const PROXY_URL = "https://corsproxy.io/?";

/**
 * Fetches the list of packages from a publisher and then fetches detailed
 * scores for each package, using a CORS proxy.
 */
function fetchPubDevPackages() {
  const packageListContainer = document.getElementById("pub-package-list");
  if (!packageListContainer) {
    console.error("Pub.dev package list container not found");
    return;
  }

  // Step 1: Define the target URL and encode it
  const searchUrl = "https://pub.dev/api/search?q=publisher:francescodema.dev";
  const proxiedSearchUrl = PROXY_URL + encodeURIComponent(searchUrl);

  fetch(proxiedSearchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch from proxy for search.");
      }
      return response.json(); // This is now the direct JSON from pub.dev
    })
    .then((searchResult) => {
      if (!searchResult.packages || searchResult.packages.length === 0) {
        throw new Error("No packages found for this publisher.");
      }

      // Step 2: Create a list of promises to fetch details for each package
      const fetchPromises = searchResult.packages.map((pkgSummary) => {
        const detailUrl = `https://pub.dev/api/packages/${pkgSummary.package}`;
        const proxiedDetailUrl = PROXY_URL + encodeURIComponent(detailUrl);

        return fetch(proxiedDetailUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Package details not found: ${pkgSummary.package}`
              );
            }
            return response.json(); // Direct JSON
          })
          .catch((error) => {
            console.error(error);
            return null; // Return null on error
          });
      });

      // Step 3: Wait for all detail fetches to complete
      return Promise.all(fetchPromises);
    })
    .then((allPackageData) => {
      const validPackages = allPackageData.filter((pkg) => pkg !== null);

      if (validPackages.length === 0) {
        packageListContainer.innerHTML =
          "<p>Could not load any pub.dev packages.</p>";
        return;
      }

      packageListContainer.innerHTML = "";

      validPackages.sort(
        (a, b) =>
          (b.score?.popularityScore || 0) - (a.score?.popularityScore || 0)
      );

      validPackages.forEach((pkg) => {
        const card = createPackageCard(pkg);
        packageListContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching pub.dev packages:", error);
      if (packageListContainer) {
        packageListContainer.innerHTML = `<p>${
          error.message || "Could not load packages."
        }</p>`;
      }
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
  const maxPoints = 140;

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

  card.addEventListener("click", () => {
    window.open(latest.package_url, "_blank");
  });
  card.style.cursor = "pointer";

  return card;
}

fetchPubDevPackages();
