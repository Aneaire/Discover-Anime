// Function to add the "active-link" class to the current page link
function setActiveLink() {
  // Get the current page URL
  const currentPage = window.location.pathname;

  // Define the mapping of URLs to link elements
  const links = {
    "/index.html": "home",
    "/about.html": "about",
    "/profile.html": "profile",
  };

  // Loop through the links and add the "active-link" class to the matching link
  for (const path in links) {
    if (currentPage.endsWith(path)) {
      const linkId = links[path];
      document.getElementById(linkId).classList.add("active-link");
      break;
    }
  }
}

// Call the function to set the active link
setActiveLink();

// listen to logoNav class click
document.getElementById("logoNav").addEventListener("click", function () {
  window.location.href = "index.html";
});
