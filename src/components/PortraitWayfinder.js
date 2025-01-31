import PortraitWayFindFloorMapper from "./PortraitWayFindFloorMapper.js";

class PortraitWayfinder {
  constructor(app, props) {
    this.app = app;
    this.props = props;
    this.mapper = null;
    this.searchText = "";
    this.clickedSensorId = null;
    this.clearTimeoutId = null;
    this.init();
  }

  async init() {
    if (!this.app) {
      console.error("Main App not found!");
      return;
    }

    this.app.innerHTML = this.getTemplate();
    this.bindEvents();

    try {
      const response = await fetch('../../../../../public/data/StaticWayfindSensorData.json');
      const StaticSensorData = await response.json();
      this.setupMapper(StaticSensorData);
    } catch (error) {
      console.error("Failed to load sensor data:", error);
    }
  }

  getTemplate() {
    return `
      <div class="layout-header">
        <div class="logo-clipped">
          <img src="${this.getHeaderLogo()}" class="logo-clipped-img" />
        </div>
        <div class="floor-info"></div>
        <div class="pilot-test">(Pilot Test)</div>
      </div>
      <div class="live-wayfinding-portrait">
        <div class="floor-mapping">
          <div class="floor-map-wrapper">
            <div id="floor-map" class="floor-map"></div>
          </div>
        </div>
        <div class="layout-footer">
          <div class="layout-legend">
            <div class="layout-legend__title">LEGEND</div>
            <div class="layout-legend__wrapper">
              <div class="layout-legends">
                ${this.getLegendsHTML()}
              </div>
            </div>
          </div>
          <div class="mobile-wrapper">
            <div class="layout-map">
              <div class="layout-map__header">
                <div class="layout-map__logo">
                  <img src="${this.getHeaderLogo()}" alt="Company Logo" />
                </div>
                <div class="layout-map__title">FLOOR MAP</div>
                <div class="layout-map__datetime">
                  <!-- TimeWidget placeholder -->
                </div>
              </div>
              <div class="layout-map__rooms">
                <div class="layout-map__search">
                  <input type="text" id="search-input" placeholder="Search room name" />
                </div>
                <div class="layout-map__rooms-wrapper">
                  ${this.getSensorListHTML()}
                </div>
              </div>
            </div>
            <div class="layout-legend">
              <div class="layout-legend__title">QR Code</div>
              <div class="layout-legend__wrapper">
                <div class="layout-legends">
                  <div id="qr-section"></div>
                  <canvas id="qr-block"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getHeaderLogo() {
    const { company } = this.props;
    return company.ref_id === "8307f9b7-60c2-4cf4-890a-9a76574b5710" ? "/images/logos/Netflix-N-Logo.png"
      : company.ref_id === "1601b980-4095-4477-88f3-fd88b545213c" ? "/images/logos/the-world-bank-logo.png"
      : `/storage/logos/${company.logo}`;
  }

  getLegendsHTML() {
    const legends = [
      { icon: "MensRestroom", label: "Men's Restroom" },
      { icon: "WomensRestroom", label: "Women's Restroom" },
      { icon: "Cafeteria", label: "Cafeteria" },
      { icon: "HydrationStation", label: "Hydration Station" },
      { icon: "CopyStation", label: "Copy/ Shredding/ Stationery Station" },
      { icon: "PrayerRoom", label: "Prayer Room" },
      { icon: "EmergencyExit", label: "Emergency Exit" },
      { icon: "Elevator", label: "Elevator" },
      { icon: "YouAreHere", label: "You Are Here" },
    ];

    return legends.map(legend => `
      <div class="layout-legend__item" data-label="${legend.label}">
        <div class="layout-legend__item-icon">
          <!-- Icon placeholder -->
        </div>
        <div class="layout-legend__item-label">${legend.label}</div>
      </div>
    `).join('');
  }

  getSensorListHTML(sensors) {
    const sortedSensors = sensors.sort((a, b) => Number(a.room_no) - Number(b.room_no));

    return sortedSensors.map(sensor => `
      <div class="layout-map__room" data-id="${sensor.id}">
        <div class="layout-map__room-circle" id="${sensor.id}">${sensor.room_no}</div>
        <div class="layout-map__room-name">${sensor.name}</div>
      </div>
    `).join('');
  }

  bindEvents() {
    document.getElementById('floor-map').addEventListener('click', this.bldgClick.bind(this));
    document.getElementById('search-input').addEventListener('input', this.handleSearch.bind(this));
    document.querySelectorAll('.layout-legend__item').forEach(item => {
      item.addEventListener('click', () => this.handleLableClick(item.dataset.label));
    });
    document.querySelectorAll('.layout-map__room').forEach(room => {
      room.addEventListener('click', () => this.handleSensorClick(room.dataset.id));
    });
  }

  setupMapper(StaticSensorData) {
    this.mapper = new PortraitWayFindFloorMapper("#floor-map", StaticSensorData[0], {
      live: true,
      livePulse: true,
      wayFinding: true,
      sensorSize: 8,
      sensorColors: ["#2398FF", "#CC210F", "#E0B42F"],
      filters: this.props.filters,
      events: {
        imgLoaded: () => {
          this.emitLoaded();
        },
      },
    });

    // Update the sensor list HTML after fetching the data
    const sensorListHTML = this.getSensorListHTML(StaticSensorData[0].sensors);
    document.querySelector('.layout-map__rooms-wrapper').innerHTML = sensorListHTML;
  }

  emitLoaded() {
    // Emit loaded event
    console.log("Map loaded");
  }

  bldgClick() {
    console.log("bldg clicked");
    this.clearSearch();
  }

  handleLableClick(label) {
    console.log("label clicked", label);
  }

  handleSensorClick(sensorId) {
    console.log("sensor clicked", sensorId);
    this.clickedSensorId = sensorId;
    this.clearTimeoutId = setTimeout(this.clearSearch.bind(this), 15000);
  }

  handleSearch() {
    clearTimeout(this.clearTimeoutId);
    this.clearTimeoutId = setTimeout(this.clearSearch.bind(this), 15000);
  }

  clearSearch() {
    this.searchText = "";
    this.clickedSensorId = null;
  }

  redrawFloor() {
    if (this.mapper) {
      this.mapper.redraw(true, true);
    }
  }

  sensorSize(type, size) {
    if (this.mapper) {
      this.mapper.setSensorSize(type, size);
      this.mapper.drawSensors(true, type);
    }
  }

  setColor(id, state) {
    if (this.mapper) {
      this.mapper.setSensorColor(id, state);
    }
  }

  setCount(id, count) {
    if (this.mapper) {
      this.mapper.setSensorCounter(id, count);
    }
  }
}

export default PortraitWayfinder;
