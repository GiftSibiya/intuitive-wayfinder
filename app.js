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
      document.getElementById('status').innerText = "You're offline. Showing saved content.";
      document.getElementById('status').style.color = "red";

      const savedContent = localStorage.getItem('offlineContent');
      if (savedContent) {
          document.getElementById('content').innerHTML = savedContent;
      } else {
          document.getElementById('content').innerHTML = "No offline content available.";
      }
  } else {
      document.getElementById('status').innerText = "You're online.";
      document.getElementById('status').style.color = "green";
  }
}

// Expose functions for use in index.html
window.saveContent = saveContent;
window.loadOfflineContent = loadOfflineContent;
