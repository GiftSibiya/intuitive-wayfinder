// PortraitWayfinder.js
async function renderPortraitWayfinder(container, props) {

  // ========== Variables ========== //

  let wayfindTimeout; // Wayfinding Screen Timeout
  let BUILDING_INFO = window.sensorData;
  let BUILDING_DATA = window.sensorData.sensors.filter(sensor => sensor.sensor_state === 'available' && sensor.hideOnLive === false);
  let ALL_SENSOR_DATA = window.sensorData.sensors.filter(sensor => sensor.sensor_state !== 'legend' && sensor.hideOnLive === false && sensor.dubplicate === false);
  let SENSOR_DATA = window.sensorData.sensors.filter(sensor => sensor.sensor_state !== 'legend' && sensor.sensor_state !== 'invisible' && sensor.hideOnLive === false);
  let LEGEND_DATA = window.sensorData.sensors.filter(sensor => sensor.sensor_state === 'legend' && sensor.hideOnLive === false);
  let INVISIBLE_LIST_ITEMS = window.sensorData.sensors.filter(sensor => sensor.sensor_state === 'invisible' && sensor.hideOnLive === false);
  let INVISIBLE_MAP_ITEMS = window.sensorData.sensors.filter(sensor => sensor.hideOnLive === true);
  let searchTimeout;

  // ========== Functions ========== //

  const handleSensorClick = (sensor) => {


    // Subscription logic
    const subscriptionExpiry = "2026-04-30 23:00:00";
    const storedExpiry = localStorage.getItem('subscriptionExpiry');
    localStorage.clear();

    if (!storedExpiry) {
      // First time access, set start time
      localStorage.setItem('subscriptionExpiry', new Date(subscriptionExpiry).getTime());
    } else {
      const currentTime = Date.now();
      const expiryTime = parseInt(storedExpiry, 10);

      if (currentTime >= expiryTime) {
        document.body.innerHTML = "<h1>Subscription Expired. Please Renew.</h1>";
        return; // Stop app execution
      } else {
        // console.log("Subscription is still valid.");
      }
    }


    let wayfindDuration = 15000;
    // console.log('Sensor clicked:', sensor);

    const existingSensorPic = document.getElementById('sensor-overlay'); // Remove Existing Image
    if (existingSensorPic) {
      existingSensorPic.remove();
      clearTimeout(wayfindTimeout); // Reset the timeout
    }

    const sensorPic = document.createElement('img');
    sensorPic.src = `./src/assets/images/plans/${sensor.name}.png`;
    sensorPic.id = 'sensor-overlay';
    sensorPic.style.position = 'absolute';
    sensorPic.style.top = '100%';
    sensorPic.style.left = '50%';
    sensorPic.style.transform = 'translate(-50%, -100%)';
    sensorPic.style.width = '100%';
    sensorPic.style.height = '100%';
    sensorPic.style.objectFit = '';
    sensorPic.style.backgroundColor = 'transparent';
    sensorPic.style.pointerEvents = 'none';

    floorMapContainer.appendChild(sensorPic);

    const existingSelectedRoomName = document.getElementById('selected-room-name');
    if (existingSelectedRoomName) {
      existingSelectedRoomName.remove();
    };

    const selectedRoomName = document.createElement('div');
    selectedRoomName.id = 'selected-room-name';
    selectedRoomName.style.color = 'white';
    selectedRoomName.style.fontSize = '1.5rem';
    selectedRoomName.style.fontWeight = 'bold';
    selectedRoomName.innerHTML = `Selected Room:  ${sensor.sensor_state === 'legend' ? sensor.parent_id : sensor.name} <br/> Room Status: ${sensor.sensor_state}`;

    wayfindTimeout = setTimeout(() => { // Start a new timeout
      if (document.getElementById('sensor-overlay')) {
        document.getElementById('sensor-overlay').remove();
        document.getElementById('qr-image').remove();
        document.getElementById('selected-room-name').remove();
        // Clear the search input and reset results
        const searchInput = document.getElementById('wayfinder-searchInput');
        if (searchInput) {
          searchInput.value = '';
          filterSensors(''); // Reset the sensor list
        }
      }
    }, wayfindDuration);
  };

  const filterSensors = (query) => {
    const filteredSensors = ALL_SENSOR_DATA.filter(sensor =>
      sensor.name.toLowerCase().includes(query.toLowerCase())
    );
    updateSensorList(filteredSensors);
  };

  const updateSensorList = (sensors) => {
    sensorList.innerHTML = ''; // Clear the existing list
    sensors.forEach(sensor => {
      const sensorListItem = document.createElement('div');
      sensorListItem.id = 'wayfinder-sensorListItem';
      sensorListItem.style.display = 'flex';
      sensorListItem.style.flexDirection = 'row';
      sensorListItem.style.alignContent = 'center';
      sensorListItem.style.width = '90%';
      sensorListItem.style.height = '30px';
      sensorListItem.style.border = '2px solid white';
      sensorListItem.style.borderRadius = '5px';
      // sensorListItem.style.backgroundColor = '#FFD700';
      sensorListItem.style.marginBottom = '5px';
      sensorListItem.style.padding = '5px';
      sensorListItem.addEventListener('click', () => handleSensorClick(sensor));
      sensorList.appendChild(sensorListItem);

      const sensorNumber = document.createElement('div');
      sensorNumber.textContent = sensor.room_no;
      sensorNumber.id = 'wayfinder-sensorNumber';
      sensorNumber.style.backgroundColor = 'red';
      sensorNumber.style.display = 'flex';
      sensorNumber.style.justifyContent = 'center';
      sensorNumber.style.alignItems = 'center';
      sensorNumber.style.width = '20px';
      sensorNumber.style.height = '20px';
      sensorNumber.style.fontSize = '12px';
      sensorNumber.style.color = 'white';
      sensorNumber.style.borderRadius = '100%';

      sensorListItem.appendChild(sensorNumber);

      const sensorItem = document.createElement('div');
      sensorItem.id = 'wayfinder-sensorItem';
      sensorItem.textContent = sensor.name;
      sensorItem.style.display = 'flex';
      sensorItem.style.color = 'white';
      sensorItem.style.flexDirection = 'row';
      sensorItem.style.width = '50%';
      sensorItem.style.fontSize = '12px';
      sensorItem.style.marginLeft = '12px';
      sensorItem.style.height = '45px';
      sensorListItem.appendChild(sensorItem);

    });
  };

  // ========== ========== //

  // ========== UI COMPONENTS ========== //

  const mainContainer = document.createElement('div');
  mainContainer.id = 'wayfinder-mainContainer';
  mainContainer.style.width = '100vw';
  mainContainer.style.height = '100vh';
  mainContainer.style.display = 'flex';
  mainContainer.style.flexDirection = 'column';
  mainContainer.style.alignItems = 'center';
  container.appendChild(mainContainer);

  // ----- Top Container ----- //

  const topContainer = document.createElement('div');
  topContainer.id = 'wayfinder-topContainer';
  topContainer.style.width = '100%'; // Landscape
  topContainer.style.height = '30%'; // Portrait
  // topContainer.style.height = '70%'; // Landscape
  topContainer.style.margin = '0px 50px';
  topContainer.style.display = 'flex';
  topContainer.style.justifyContent = 'center';
  topContainer.style.alignItems = 'center';
  topContainer.style.backgroundColor = 'white';
  mainContainer.appendChild(topContainer);

  const floorMapContainer = document.createElement('div');
  floorMapContainer.id = 'wayfinder-floorMapContainer';
  floorMapContainer.style.display = 'flex';
  floorMapContainer.style.justifyContent = 'center';
  floorMapContainer.style.alignItems = 'center';
  floorMapContainer.style.position = 'relative';
  floorMapContainer.style.width = '90vw';
  floorMapContainer.style.height = '100%';

  const logoContainer = document.createElement('div');
  logoContainer.id = 'wayfinder-logoContainer';
  logoContainer.style.display = 'flex';
  logoContainer.style.position = 'absolute';
  logoContainer.style.top = '0';
  logoContainer.style.left = '0';
  logoContainer.style.margin = '10px';
  logoContainer.style.justifyContent = 'center';
  logoContainer.style.zIndex = '100';
  logoContainer.style.alignItems = 'center';
  logoContainer.style.height = '50px';
  topContainer.appendChild(logoContainer);

  const logo = document.createElement('img');
  logo.src = `./src/assets/images/logos/logo.png`;
  logo.style.objectFit = 'fill';
  logo.id = 'wayfinder-logo';
  logo.style.width = '100%';
  logo.style.height = '100%';
  logoContainer.appendChild(logo);

  floorMapContainer.addEventListener('fullscreenchange', () => {
    const floorMapContainerElement = document.getElementById('wayfinder-floorMapContainer');

    if (document.fullscreenElement) {
      // console.log('Entered Fullscreen');
      floorMapContainer.style.height = '60vh';
    } else {
      // console.log('Exited Fullscreen');
      floorMapContainerElement.style.border = '2px solid black';
    }
  });

  // Request fullscreen for testing
  mainContainer.addEventListener('click', () => {
    if (mainContainer.requestFullscreen) {
      mainContainer.requestFullscreen();
    }
  });


  topContainer.appendChild(floorMapContainer);

  const floorMapImage = document.createElement('div');
  floorMapImage.id = 'wayfinder-floorMapImage';
  floorMapImage.style.display = 'flex';
  floorMapImage.style.justifyContent = 'center';
  floorMapImage.style.alignItems = 'center';
  floorMapImage.style.position = 'relative';
  floorMapImage.style.width = '100%'; // Landscape
  floorMapImage.style.height = '100%';
  floorMapImage.style.objectFit = 'contain';
  floorMapImage.style.backgroundColor = 'transparent';
  floorMapImage.style.color = 'black';
  floorMapImage.style.zIndex = '0';
  floorMapContainer.appendChild(floorMapImage);

  const floorMapOverlay = document.createElement('img');
  floorMapOverlay.src = `./src/assets/images/${BUILDING_INFO.floor_plan_url}`;
  floorMapOverlay.id = 'wayfinder-floorMapOverlay';
  floorMapOverlay.style.display = 'flex';
  floorMapOverlay.style.justifyContent = 'center';
  floorMapOverlay.style.alignItems = 'center';
  floorMapOverlay.style.position = 'absolute';
  floorMapOverlay.style.width = '100%';
  floorMapOverlay.style.height = '100%';
  floorMapOverlay.style.objectFit = 'fill';
  floorMapOverlay.style.backgroundColor = 'transparent';
  floorMapOverlay.style.color = 'black';
  floorMapOverlay.style.zIndex = '1';
  floorMapImage.appendChild(floorMapOverlay);


  // ----- BOTTOM CONTAINER ----- //

  const bottomContainer = document.createElement('div');
  bottomContainer.id = 'wayfinder-bottomContainer';
  bottomContainer.style.display = 'flex';
  bottomContainer.style.flexDirection = 'row';
  bottomContainer.style.width = '100%';
  bottomContainer.style.overflow = 'hidden';
  bottomContainer.style.height = '80vh';
  // bottomContainer.style.height = '30vh';
  bottomContainer.style.backgroundColor = '#211f20';
  mainContainer.appendChild(bottomContainer);

  //----- Sensor Container ----- //

  // Legend Container

  const legendContainer = document.createElement('div');
  legendContainer.id = 'wayfinder-legendContainer';
  legendContainer.style.display = 'flex';
  legendContainer.style.width = '20%';
  legendContainer.style.flexDirection = 'column';
  legendContainer.style.height = '100%';
  legendContainer.style.backgroundColor = '#211f20';
  legendContainer.style.overflow = 'auto';
  legendContainer.style.marginRight = '20px';

  bottomContainer.appendChild(legendContainer);

  const legendWrapper = document.createElement('div');
  legendWrapper.style.display = 'flex';
  legendWrapper.style.flexDirection = 'column';
  legendWrapper.style.flex = '1';
  legendWrapper.style.padding = '1vh';
  legendWrapper.style.overflow = 'auto';
  legendWrapper.style.backgroundColor = '#32313d';

  const legendText = document.createElement('h3');
  legendText.textContent = 'Legend';
  legendText.style.padding = '1vh';
  legendText.style.fontSize = '1vh'; // Portrait
  legendText.style.fontWeight = '500';
  legendText.style.color = 'white';
  legendText.style.alignSelf = 'flex-start';

  legendWrapper.appendChild(legendText);

  const legendList = document.createElement('div');
  legendList.style.display = 'flex';
  legendList.style.flexDirection = 'column';
  legendList.style.gap = '1vh';
  legendWrapper.appendChild(legendList);

  if (BUILDING_DATA && LEGEND_DATA) {
    LEGEND_DATA.forEach(legend => {
      const legendItem = document.createElement('div');
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      legendItem.style.gap = '0.7vh';
      legendItem.style.color = 'white';
      legendItem.style.fontSize = '0.71vh'; // Portrait
      // legendItem.style.fontSize = '1.5vh'; // Landscape
      legendItem.style.fontWeight = '500';
      legendItem.style.cursor = 'pointer';
      legendItem.style.borderRadius = '20px';
      legendItem.style.padding = '0.5vh';
      legendItem.addEventListener('click', () => handleSensorClick(legend));

      const legendIcon = document.createElement('img');
      legendIcon.src = `./src/assets/images/icons/${legend.parent_id}.svg`;
      // legendIcon.style.width = '1vh'; // Portrait
      // legendIcon.style.height = '1vh'; // Portrait
      legendIcon.style.width = '1.5vh'; // Landscape
      legendIcon.style.height = '1.5vh'; // Landscape
      legendIcon.style.filter = 'invert(100%)';

      const legendText = document.createElement('span');
      legendText.textContent = legend.parent_id;
      legendText.style.marginLeft = '0.7vh';

      legendItem.appendChild(legendIcon);
      legendItem.appendChild(legendText);
      legendList.appendChild(legendItem);
    });
  };

  legendContainer.appendChild(legendWrapper);

  // -----  ----- //

  const sensorContainer = document.createElement('div');
  sensorContainer.id = 'wayfinder-sensorContainer';
  sensorContainer.style.width = '100%';
  sensorContainer.style.height = '100%';
  // sensorContainer.style.overflowY = 'scroll';
  bottomContainer.appendChild(sensorContainer);

  const sensorTitleContainer = document.createElement('div');
  sensorTitleContainer.id = 'wayfinder-sensorTitle';
  sensorTitleContainer.style.width = '95%';
  sensorTitleContainer.style.height = '35px';
  sensorTitleContainer.style.display = 'flex';
  sensorTitleContainer.style.padding = '10px';
  sensorTitleContainer.style.flexDirection = 'row';
  sensorTitleContainer.style.justifyContent = 'space-beween';
  sensorTitleContainer.style.alignItems = 'center';
  sensorContainer.appendChild(sensorTitleContainer);

  const sensorTitleText = document.createElement('div');
  sensorTitleText.id = 'wayfinder-sensorTitleText';
  sensorTitleText.textContent = `Floor: ${BUILDING_INFO.number} `;
  sensorTitleText.style.width = '20%';
  sensorTitleText.style.color = 'white';
  sensorTitleText.style.fontWeight = 'bold';
  sensorTitleText.style.display = 'flex';
  sensorTitleText.style.alignItems = 'center';
  sensorTitleText.style.justifyContent = 'flex-start';
  sensorTitleText.style.textAlign = 'left';
  sensorTitleContainer.appendChild(sensorTitleText);

  //  Time Container

  const timeContainer = document.createElement('div');
  timeContainer.id = 'wayfinder-timeContainer';
  Object.assign(timeContainer.style, {
    width: '70%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '1vh'
  });
  sensorTitleContainer.appendChild(timeContainer);

  const timeText = document.createElement('div');
  timeText.id = 'wayfinder-timeText';

  function updateTime() {
    const now = new Date();
    const hour = now.getHours();
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeText.textContent = `${hour12}:${minutes}:${seconds} ${ampm}`;
  }

  // Initial update
  updateTime();

  // Update every second
  setInterval(updateTime, 1000);

  Object.assign(timeText.style, {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });
  timeContainer.appendChild(timeText);

  const dateText = document.createElement('div');
  dateText.id = 'wayfinder-dateText';
  dateText.textContent = new Date().toDateString();
  Object.assign(dateText.style, {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });
  timeContainer.appendChild(dateText);

  // -----  ----- //

  // ----- Search Container ----- //

  const searchContainer = document.createElement('div');
  searchContainer.id = 'wayfinder-searchContainer';
  searchContainer.style.width = '100%';
  searchContainer.style.marginBottom = '20px'; // Taken from .layout-map__search
  searchContainer.style.display = 'flex';
  searchContainer.style.flexDirection = 'column';
  searchContainer.style.alignItems = 'center';
  searchContainer.style.justifyContent = 'center';

  sensorContainer.appendChild(searchContainer);

  const searchInput = document.createElement('input');
  searchInput.id = 'wayfinder-searchInput';
  searchInput.type = 'text';
  searchInput.placeholder = 'Search room name...';
  searchInput.style.width = '95%';
  searchInput.style.height = '35px';
  searchInput.style.padding = '5px';
  searchInput.style.border = '1px solid #ccc';
  searchInput.style.borderRadius = '50px';
  searchInput.style.backgroundColor = '#32313d';
  searchInput.style.color = '#ffffff';
  searchInput.style.fontSize = '16px';
  searchInput.style.textAlign = 'left';
  searchInput.style.outline = 'none';
  searchInput.style.caretColor = '#ffffff';

  searchInput.addEventListener('focus', () => {
    searchInput.placeholder = '';
  });
  searchInput.addEventListener('blur', () => {
    searchInput.placeholder = 'Search room name...';
  });

  searchInput.addEventListener('input', (event) => {
    filterSensors(event.target.value);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout to reset after 15 seconds
    searchTimeout = setTimeout(() => {
      searchInput.value = '';
      filterSensors('');
    }, 15000);
  });

  searchContainer.appendChild(searchInput);

  // -----  ----- //

  const sensorList = document.createElement('div');
  sensorList.id = 'wayfinder-sensorList';
  sensorList.style.width = '95%';
  sensorList.style.display = 'grid';
  sensorList.style.paddingRight = '20px';
  sensorList.style.marginLeft = '15px';
  sensorList.style.paddingLeft = '20px';
  sensorList.style.paddingTop = '10px';
  sensorList.style.flexDirection = 'column';
  sensorList.style.alignItems = 'center';
  sensorList.style.gridTemplateColumns = 'repeat(2, minmax(100px, 2fr))';
  sensorList.style.justifyContent = 'center';
  sensorList.style.cursor = 'pointer';
  sensorList.style.transition = 'background-color 200ms';
  sensorContainer.appendChild(sensorList);

  if (BUILDING_DATA && ALL_SENSOR_DATA) { // Access the global sensorData object
    ALL_SENSOR_DATA
      .sort((a, b) => a.room_no - b.room_no)
      .forEach(sensor => {

        // ----- Sensor List Items ----- //
        const sensorListItem = document.createElement('div');
        sensorListItem.id = 'wayfinder-sensorListItem';
        sensorListItem.style.display = 'flex';
        sensorListItem.style.flexDirection = 'row';
        sensorListItem.style.alignContent = 'center';
        sensorListItem.style.width = '90%';
        sensorListItem.style.height = '30px';
        sensorListItem.style.border = '2px solid white';
        sensorListItem.style.borderRadius = '5px';
        // sensorListItem.style.backgroundColor = '#FFD700';
        sensorListItem.style.marginBottom = '5px';
        sensorListItem.style.padding = '5px';
        sensorListItem.addEventListener('click', () => handleSensorClick(sensor));
        sensorList.appendChild(sensorListItem);

        // const sensorNumber = document.createElement('div');
        // sensorNumber.textContent = sensor.room_no;
        // sensorNumber.id = 'wayfinder-sensorNumber';
        // sensorNumber.style.backgroundColor = 'red';
        // sensorNumber.style.display = 'flex';
        // sensorNumber.style.justifyContent = 'center';
        // sensorNumber.style.alignItems = 'center';
        // sensorNumber.style.width = '20px';
        // sensorNumber.style.height = '20px';
        // sensorNumber.style.fontSize = '12px';
        // sensorNumber.style.color = 'white';
        // sensorNumber.style.borderRadius = '100%';

        // sensorListItem.appendChild(sensorNumber);

        const sensorItem = document.createElement('div');
        sensorItem.id = 'wayfinder-sensorItem';
        sensorItem.textContent = sensor.name;
        sensorItem.style.display = 'flex';
        sensorItem.style.color = 'white';
        sensorItem.style.flexDirection = 'row';
        sensorItem.style.width = '100%';
        sensorItem.style.fontSize = '12px';
        sensorItem.style.marginLeft = '12px';
        sensorItem.style.height = '45px';
        sensorListItem.appendChild(sensorItem);
        // ----- ----- //

      });
  } else {
    console.error("sensorData is not defined or missing 'sensors'");
  }

  // ----- Map Senors ----- //
  if (BUILDING_DATA && SENSOR_DATA) {
    SENSOR_DATA.forEach(sensor => {
      const mapSensor = document.createElement('div');
      mapSensor.id = 'wayfinder-mapSensor';
      // mapSensor.innerText = sensor.name;
      mapSensor.style.fontSize = '1vh'; // Landscape
      mapSensor.style.position = 'absolute';
      // mapSensor.style.backgroundColor = 'rgb(0, 86, 126)';
      mapSensor.style.left = `${sensor.pos_x - 0.9}%`;
      mapSensor.style.top = `${sensor.pos_y}%`;
      mapSensor.style.width = '7.8vh'; // Landscape
      mapSensor.style.height = '5.8vh'; // Landscape
      mapSensor.style.color = 'white';
      mapSensor.style.display = 'flex';
      mapSensor.style.zIndex = '20';
      mapSensor.style.alignItems = 'center';
      mapSensor.style.cursor = 'pointer';
      mapSensor.style.justifyContent = 'center';
      mapSensor.addEventListener('click', () => handleSensorClick(sensor));
      floorMapImage.appendChild(mapSensor);
    });
  }

  // Add invisible sensors
  if (BUILDING_DATA && INVISIBLE_LIST_ITEMS) {
    INVISIBLE_LIST_ITEMS.forEach(sensor => {
      const invisibleSensor = document.createElement('div');
      invisibleSensor.id = 'wayfinder-invisibleSensor';
      invisibleSensor.style.position = 'absolute';
      invisibleSensor.style.left = `${sensor.pos_x - 0.9}%`;
      invisibleSensor.style.top = `${sensor.pos_y}%`;
      invisibleSensor.style.width = '5vh'; // Landscape
      invisibleSensor.style.height = '5vh'; // Landscape
      // invisibleSensor.style.backgroundColor = 'rgb(5, 5, 5)';
      invisibleSensor.style.zIndex = '20';
      invisibleSensor.style.cursor = 'pointer';
      invisibleSensor.addEventListener('click', () => handleSensorClick(sensor));
      floorMapImage.appendChild(invisibleSensor);
    });
  }

  if (BUILDING_DATA && INVISIBLE_MAP_ITEMS) {
    INVISIBLE_MAP_ITEMS.forEach(sensor => {
      const invisibleSensor = document.createElement('div');
      invisibleSensor.id = 'wayfinder-invisibleSensor';
      invisibleSensor.style.position = 'absolute';
      invisibleSensor.style.left = `${sensor.pos_x - 0.9}%`;
      invisibleSensor.style.top = `${sensor.pos_y}%`;
      invisibleSensor.style.width = '3vh'; // Landscape
      invisibleSensor.style.height = '3vh'; // Landscape
      invisibleSensor.style.zIndex = '20';
      invisibleSensor.style.cursor = 'pointer';
      // invisibleSensor.style.backgroundColor = 'rgb(16, 160, 124)';
      invisibleSensor.addEventListener('click', () => handleSensorClick(sensor));
      floorMapImage.appendChild(invisibleSensor);
    });
  }

  // -----  ----- //

  // ----- QR Code Container ----- //

  // const qrCodeSection = document.createElement('div');
  // qrCodeSection.id = 'wayfinder-qrCodeSection';
  // qrCodeSection.style.width = '20%';
  // qrCodeSection.style.display = 'flex';
  // qrCodeSection.style.flexDirection = 'column';
  // qrCodeSection.style.alignItems = 'center';
  // qrCodeSection.style.justifyContent = 'center';
  // bottomContainer.appendChild(qrCodeSection);

  // ========== ========== //

}

// ========== GLOBAL FUNCTIONS ========== //
window.renderPortraitWayfinder = renderPortraitWayfinder;
// ==========  ========== //
