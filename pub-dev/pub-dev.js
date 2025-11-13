/**
 * A proxy URL to bypass CORS restrictions.
 * We use api.codetabs.com which passes the response directly.
 */
const PROXY_URL = "https://api.codetabs.com/v1/proxy?quest=";

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

  const searchUrl = "https://pub.dev/api/search?q=publisher:francescodema.dev";
  const proxiedSearchUrl = PROXY_URL + searchUrl;

  fetch(proxiedSearchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch from proxy for search.");
      }
      return response.json();
    })
    .then((searchResult) => {
      if (!searchResult.packages || searchResult.packages.length === 0) {
        throw new Error("No packages found for this publisher.");
      }

      // Step 2: Create a list of promises to fetch details AND scores
      const fetchPromises = searchResult.packages.map((pkgSummary) => {
        const detailUrl = `https://pub.dev/api/packages/${pkgSummary.package}`;
        const scoreUrl = `https://pub.dev/api/packages/${pkgSummary.package}/score`;

        const proxiedDetailUrl = PROXY_URL + detailUrl;
        const proxiedScoreUrl = PROXY_URL + scoreUrl;

        const detailPromise = fetch(proxiedDetailUrl).then((res) => res.json());
        const scorePromise = fetch(proxiedScoreUrl).then((res) => res.json());

        // Combine them when both are done
        return Promise.all([detailPromise, scorePromise])
          .then(([detailData, scoreData]) => {
            // --- FIX: The scoreData *is* the score object ---
            return {
              latest: detailData.latest, // Get 'latest' from detail
              score: scoreData, // Use the whole scoreData object
            };
          })
          .catch((error) => {
            console.error(
              `Failed to fetch data for ${pkgSummary.package}`,
              error
            );
            return null;
          });
      });

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

  // Use the data from the fetched score object
  const popularity = Math.round((score.popularityScore || 0) * 100);
  const pubPoints = score.grantedPoints || 0;
  const likeCount = score.likeCount || 0;
  const maxPoints = score.maxPoints || 140; // Use maxPoints from API if available

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
                <strong>${likeCount}</strong>
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

  /**
   * Adds the redirect interaction to the card.
   */
  card.addEventListener("click", () => {
    window.open(latest.package_url, "_blank");
  });
  card.style.cursor = "pointer";

  return card;
}

fetchPubDevPackages();
