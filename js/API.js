// Define the base URL for the GET request to fetch the top anime
const baseUrl = "https://api.jikan.moe/v4/top/anime";
let page = 1;
let isLoading = false;
let currentSearchQuery = "";

// Function to fetch and display anime
async function fetchAndDisplayAnime() {
  if (isLoading) return; // Prevent multiple fetches
  isLoading = true;

  const loadingElement = document.getElementById("loadingToFetch");
  const animeContainerElement = document.getElementById("anime-container");

  try {
    const response = await fetch(`${baseUrl}?page=${page}`);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();

    console.log(data);
    const animeList = data.data;
    if (animeList.length === 0) {
      loadingElement.textContent = "No more anime to load";
      return;
    }

    animeList.forEach((anime) => {
      const card = document.createElement("div");
      card.className = "anime-card";

      const image = document.createElement("img");
      image.src = anime.images.jpg.image_url;
      card.appendChild(image);

      const title = document.createElement("h3");
      title.textContent = anime.title;
      card.appendChild(title);

      const episodes = document.createElement("h5");
      episodes.textContent = `Episodes: ${anime.episodes}`;
      card.appendChild(episodes);

      animeContainerElement.appendChild(card);

      card.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.classList.add("modal");

        const iframe = document.createElement("iframe");
        iframe.src = anime.trailer.embed_url;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        modal.appendChild(iframe);

        document.body.appendChild(modal);

        modal.addEventListener("click", () => {
          document.body.removeChild(modal);
        });

        modal.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          return false;
        });
      });
    });

    page++; // Increment page number for the next fetch
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  } finally {
    isLoading = false;
  }
}

// Function to fetch and display search results
async function fetchAndDisplaySearchResults(query) {
  if (isLoading) return; // Prevent multiple fetches
  isLoading = true;

  const loadingElement = document.getElementById("loadingToFetch");
  const animeContainerElement = document.getElementById("anime-container");

  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&page=${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();

    const searchResults = data.data;
    if (searchResults.length === 0) {
      loadingElement.textContent = "No more anime to load";
      return;
    }

    searchResults.forEach((anime) => {
      const card = document.createElement("div");
      card.className = "anime-card";

      const image = document.createElement("img");
      image.src = anime.images.jpg.image_url;
      card.appendChild(image);

      const title = document.createElement("h3");
      title.textContent = anime.title;
      card.appendChild(title);

      const episodes = document.createElement("h5");
      episodes.textContent = `Episodes: ${anime.episodes}`;
      card.appendChild(episodes);

      animeContainerElement.appendChild(card);
    });

    page++; // Increment page number for the next fetch
  } catch (error) {
    console.error("There was a problem with the search operation:", error);
  } finally {
    isLoading = false;
  }
}

// Set up the Intersection Observer to watch the loading element
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      if (currentSearchQuery) {
        fetchAndDisplaySearchResults(currentSearchQuery);
      } else {
        fetchAndDisplayAnime();
      }
    }
  },
  {
    root: null, // Use the viewport as the root
    rootMargin: "0px",
    threshold: 1.0, // Trigger when the loading element is fully visible
  }
);

// Start observing the loading element
const loadingElement = document.getElementById("loadingToFetch");
observer.observe(loadingElement);

// Initial fetch
fetchAndDisplayAnime();

// Search functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", async function () {
  const searchString = this.value.trim();
  const animeContainerElement = document.getElementById("anime-container");

  // Clear anime container and reset page number
  animeContainerElement.innerHTML = "";
  page = 1;
  currentSearchQuery = searchString;

  if (searchString === "") {
    // If search input is empty, fetch and display top anime
    fetchAndDisplayAnime();
  } else {
    // If search input is not empty, perform search API request
    fetchAndDisplaySearchResults(searchString);
  }
});
