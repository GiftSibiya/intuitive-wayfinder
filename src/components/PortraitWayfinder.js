// PortraitWayfinder.js

function renderPortraitWayfinder(container) {
  const helloDiv = document.createElement('div');
  helloDiv.innerText = "Hello from PortraitWayfinder!";
  container.appendChild(helloDiv);
}

// Attach the function to the global window object
window.renderPortraitWayfinder = renderPortraitWayfinder;
