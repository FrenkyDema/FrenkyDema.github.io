let allUpdatesData = [];
let currentUpdateIndex = 0;
const UPDATES_PER_PAGE = 3;

/**
 * Fetches the latest public events (updates) from the GitHub API.
 */
function fetchUpdates() {
  fetch("https://api.github.com/users/FrenkyDema/events")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Network response was not ok. Status: " + response.status
        );
      }
      return response.json();
    })
    .then((data) => {
      allUpdatesData = data;

      const loadMoreBtn = document.getElementById("load-more-updates-btn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", loadMoreUpdates);
      } else {
        console.error("Load more updates button not found");
      }

      loadMoreUpdates();
    })
    .catch((error) => {
      const timelineContainer = document.getElementById("timeline");
      if (timelineContainer) {
        timelineContainer.innerHTML = "<p>Could not load updates.</p>";
      }
      console.error("Error fetching updates:", error);
    });
}

/**
 * Gets an appropriate Font Awesome icon class based on the event type.
 * @param {string} eventType - The type of the GitHub event.
 * @returns {string} A string of Font Awesome icon classes.
 */
function getIconForEventType(eventType) {
  if (eventType.includes("Push")) {
    return "fas fa-upload";
  } else if (eventType.includes("PullRequest")) {
    return "fas fa-code-pull-request";
  } else if (eventType.includes("Issue")) {
    return "fas fa-exclamation-circle";
  } else if (eventType.includes("Create")) {
    return "fas fa-plus-circle";
  } else if (eventType.includes("Watch") || eventType.includes("Star")) {
    return "fas fa-star";
  } else if (eventType.includes("Fork")) {
    return "fas fa-code-branch";
  }
  return "fas fa-code-branch";
}

/**
 * Generates a descriptive text message for a GitHub event.
 * @param {object} event - The GitHub event object.
 * @returns {string} A human-readable description of the event.
 */
function getEventDescription(event) {
  const eventType = event.type.replace("Event", "");
  let description = "No detailed description available.";

  try {
    // --- BUG FIX: Changed event.playload to event.payload ---
    if (
      event.type === "PushEvent" &&
      event.payload &&
      event.payload.commits &&
      event.payload.commits.length > 0
    ) {
      description = event.payload.commits[0].message;
    } else if (
      event.type === "PullRequestEvent" &&
      event.payload &&
      event.payload.pull_request
    ) {
      description = event.payload.pull_request.title;
    } else if (
      (event.type === "IssuesEvent" || event.type === "IssueCommentEvent") &&
      event.payload &&
      event.payload.issue
    ) {
      description = event.payload.issue.title;
    } else if (event.type === "CreateEvent" && event.payload) {
      description = `Created ${event.payload.ref_type}: ${
        event.payload.ref || event.repo.name
      }`;
    } else if (event.type === "WatchEvent") {
      description = `Starred the repository.`;
    }
  } catch (e) {
    console.warn("Could not parse event description:", e, event);
  }

  if (description.length > 100) {
    description = description.substring(0, 100) + "...";
  }

  return `${eventType} - ${description}`;
}

/**
 * Loads the next batch of updates into the timeline.
 */
function loadMoreUpdates() {
  const timelineContainer = document.getElementById("timeline");
  if (!timelineContainer) return;

  const nextIndex = currentUpdateIndex + UPDATES_PER_PAGE;
  const updatesToLoad = allUpdatesData.slice(currentUpdateIndex, nextIndex);

  updatesToLoad.forEach((event) => {
    const timelineItem = document.createElement("div");
    timelineItem.classList.add("timeline-item");

    const iconClass = getIconForEventType(event.type);
    const eventDescription = getEventDescription(event);
    const eventDate = new Date(event.created_at);
    const formattedDate = `${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}`;

    timelineItem.innerHTML = `
            <div class="timeline-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="timeline-content">
                <h3>${event.repo.name}</h3>
                <p>${eventDescription}</p>
                <span class="timeline-date">${formattedDate}</span>
            </div>
        `;

    timelineContainer.appendChild(timelineItem);
  });

  currentUpdateIndex = nextIndex;

  const loadMoreBtn = document.getElementById("load-more-updates-btn");
  if (loadMoreBtn) {
    if (currentUpdateIndex >= allUpdatesData.length) {
      loadMoreBtn.style.display = "none";
    } else {
      if (timelineContainer.lastElementChild) {
        timelineContainer.lastElementChild.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }
}

fetchUpdates();
