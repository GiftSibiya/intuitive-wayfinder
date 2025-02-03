// PortraitWayfinder.js

// Function to render the text in the provided container
function renderPortraitWayfinder(container) {
  const helloDiv = document.createElement('div');
  helloDiv.innerText = "Hello from PortraitWayfinder!";
  container.appendChild(helloDiv);
}

// Expose the function globally (if necessary for accessing in HTML)
window.renderPortraitWayfinder = renderPortraitWayfinder;
