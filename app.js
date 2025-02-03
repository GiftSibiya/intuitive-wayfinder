// app.js

// Function to save content when online
function saveContent() {
  const content = document.getElementById('content').innerHTML;
  localStorage.setItem('offlineContent', content);
  alert("Content saved for offline use from the app script!");
}

// Function to load cached content when offline
function loadOfflineContent() {
  if (!navigator.onLine) { // Detect offline mode
      const savedContent = localStorage.getItem('offlineContent');
      if (savedContent) {
          document.getElementById('content').innerHTML = savedContent;
      } else {
          document.getElementById('content').innerHTML = "No offline content available.";
      }
  }
}

// Expose functions for use in index.html
window.saveContent = saveContent;
window.loadOfflineContent = loadOfflineContent;

// Call the function to render the PortraitWayfinder on load
window.onload = function() {
  loadOfflineContent();
  const container = document.getElementById('wayfinder-container');
  window.renderPortraitWayfinder(container); // Render PortraitWayfinder globally
};
