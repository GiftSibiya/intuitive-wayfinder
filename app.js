// Imports

import  PortraitWayfinder  from "./src/components/PortraitWayfinder.js";

document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("app");


  if (app) {
    const wayfinder = new PortraitWayfinder(app);
    wayfinder.init();
  }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("src/js/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.error("Service Worker Error:", err));
    }
});
