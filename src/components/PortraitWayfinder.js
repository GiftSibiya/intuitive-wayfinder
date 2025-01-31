class PortraitWayfinder {
  constructor(app) {
    this.app = app;
  }

  init() {
    if (!this.app) {
      console.error("Main App not found!");
      return;
    }

    this.app.innerHTML = `
      <div style="padding: 20px; border: 1px solid #ddd; text-align: center;">
        <h2>Portrait Wayfinder</h2>
        <p>Welcome to the intuitive wayfinding system.</p>
      </div>
    `;
  }
}

export default PortraitWayfinder;
