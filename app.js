// app.js

// Call the function to render the PortraitWayfinder on load
window.onload = function() {
  const container = document.getElementById('wayfinder-container');
  container.style.width = '100vw';
  container.style.height = '100vh';
  const props = {
    floors: [],
    floor: {},
    company: { ref_id: '', logo: '' },
    filters: {},
    bldgClick: () => {},
    floorClick: () => {},
    minOccupancy: 0,
    apiVer: 1,
  };
  window.renderPortraitWayfinder(container, props); // Render PortraitWayfinder globally
};
