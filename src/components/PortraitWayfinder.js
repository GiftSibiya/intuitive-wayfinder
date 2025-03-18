// PortraitWayfinder.js
async function renderPortraitWayfinder(container, props) {

  // ========== Variables ========== //

  let wayfindTimeout; // Wayfinding Screen Timeout
  let BUILDING_DATA = window.sensorData;
  let SENSOR_DATA = window.sensorData.sensors.filter(sensor => sensor.sensor_state !== 'legend');
  let LEGEND_DATA = window.sensorData.sensors.filter(sensor => sensor.sensor_state === 'legend');
  // ========== Functions ========== //

  const handleSensorClick = (sensor) => {

    // Subscription logic
    const subscriptionExpiry = "2025-03-18 21:00:00"; // Example: March 17, 2025, at 6:00 PM
    const storedExpiry = localStorage.getItem('subscriptionExpiry');

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
        console.log("Subscription is still valid.");
      }
    }


    let wayfindDuration = 15000;
    console.log('Sensor clicked:', sensor);

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
    sensorPic.style.transform = 'translate(-50%, -99%)';
    sensorPic.style.width = '65%';
    sensorPic.style.height = '100%';
    sensorPic.style.objectFit = 'contain';
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
    console.log(sensor)
    qrCodeSection.appendChild(selectedRoomName);

    const existingQrImage = document.getElementById('qr-image'); // Remove Existing QR Image
    if (existingQrImage) {
      existingQrImage.remove();
    };

    const qrImage = document.createElement('img');
    qrImage.id = 'qr-image';
    qrImage.src = `./src/assets/images/qrCodes/${sensor.name}.png`;
    qrImage.style.width = '80%';
    qrImage.style.height = '80%';
    qrImage.style.objectFit = 'contain';

    qrCodeSection.appendChild(qrImage)

    wayfindTimeout = setTimeout(() => { // Start a new timeout
      if (document.getElementById('sensor-overlay')) {
        document.getElementById('sensor-overlay').remove();
        document.getElementById('qr-image').remove();
        document.getElementById('selected-room-name').remove();
      }
    }, wayfindDuration);
  };

  const filterSensors = (query) => {
    let sensotData = SENSOR_DATA;

    const filteredSensors = sensotData.sensors.filter(sensor =>
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
      sensorListItem.style.width = '100%';
      sensorListItem.style.height = '30px';
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
  topContainer.style.width = '100%';
  topContainer.style.height = '65%';
  topContainer.style.display = 'flex';
  topContainer.style.justifyContent = 'center';
  topContainer.style.backgroundColor = 'black';
  mainContainer.appendChild(topContainer);

  const floorMapContainer = document.createElement('div');
  floorMapContainer.id = 'wayfinder-floorMapContainer';
  floorMapContainer.style.display = 'flex';
  floorMapContainer.style.justifyContent = 'center';
  floorMapContainer.style.alignItems = 'center';
  floorMapContainer.style.position = 'relative';
  floorMapContainer.style.width = '90vw';
  floorMapContainer.style.height = '60vh';

  floorMapContainer.addEventListener('fullscreenchange', () => {

    const floorMapContainerElement = document.getElementById('wayfinder-floorMapContainer');

    if (document.fullscreenElement) {
      console.log('Entered Fullscreen');
      floorMapContainerElement.style.border = '2px solid yellow';
      floorMapContainer.style.height = '60vh';
    } else {
      console.log('Exited Fullscreen');
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

  const floorMapImage = document.createElement('img');
  floorMapImage.src = `./src/assets/images/${BUILDING_DATA.floor_plan_url}`;
  floorMapImage.id = 'wayfinder-floorMapImage';
  floorMapImage.style.position = 'absolute';
  floorMapImage.style.width = '65vw';
  floorMapImage.style.height = '100%';
  floorMapImage.style.objectFit = 'contain';
  floorMapImage.style.filter = 'invert(1)';
  floorMapImage.style.backgroundColor = 'transparent';
  floorMapImage.style.color = 'black';
  floorMapContainer.appendChild(floorMapImage);


  // ----- BOTTOM CONTAINER ----- //

  const bottomContainer = document.createElement('div');
  bottomContainer.id = 'wayfinder-bottomContainer';
  bottomContainer.style.display = 'flex';
  bottomContainer.style.flexDirection = 'row';
  bottomContainer.style.width = '100%';
  bottomContainer.style.height = '40vh';
  bottomContainer.style.backgroundColor = '#211f20';
  mainContainer.appendChild(bottomContainer);

  //----- Sensor Container ----- //

  // Legend Container

  const legendContainer = document.createElement('div');
  legendContainer.id = 'wayfinder-legendContainer';
  legendContainer.style.display = 'flex';
  legendContainer.style.width = '10%';
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
  legendText.style.fontSize = '1.5vh';
  legendText.style.fontWeight = '500';
  legendText.style.color = 'white';
  legendText.style.alignSelf = 'flex-start';

  legendWrapper.appendChild(legendText);

  const legendList = document.createElement('div');
  legendList.style.display = 'flex';
  legendList.style.flexDirection = 'row';
  legendList.style.gap = '1vh';
  legendWrapper.appendChild(legendList);

  if (BUILDING_DATA && LEGEND_DATA) {
    LEGEND_DATA.forEach(legend => {
      const legendIcon = document.createElement('img');
      legendIcon.src = `./src/assets/images/icons/${legend.parent_id}.svg`;
      legendIcon.style.width = '1.8vh';
      legendIcon.style.height = '1.8vh';
      legendIcon.style.filter = 'invert(100%)';

      legendList.appendChild(legendIcon);

      const legendItem = document.createElement('div');
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      legendItem.style.gap = '0.7vh';
      legendItem.style.color = 'white';
      legendItem.style.fontSize = '1.5vh';
      legendItem.style.fontWeight = '500';
      legendItem.style.cursor = 'pointer';
      legendItem.style.borderRadius = '20px';
      legendItem.innerHTML = legend.parent_id;
      legendItem.addEventListener('click', () => handleSensorClick(legend));

      legendList.appendChild(legendItem);


    });
  };

  legendContainer.appendChild(legendWrapper);

  // -----  ----- //

  const sensorContainer = document.createElement('div');
  sensorContainer.id = 'wayfinder-sensorContainer';
  sensorContainer.style.width = '70%';
  sensorContainer.style.height = '100%';
  sensorContainer.style.overflowY = 'scroll';
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
  sensorTitleText.textContent = `Floor: ${BUILDING_DATA.number} `;
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
  const hour = new Date().getHours();
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  timeText.textContent = `${hour12}:${new Date().getMinutes().toString().padStart(2, '0')} ${ampm}`;
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
  });

  searchContainer.appendChild(searchInput);

  // -----  ----- //

  const sensorList = document.createElement('div');
  sensorList.id = 'wayfinder-sensorList';
  sensorList.style.width = '94%';
  sensorList.style.display = 'grid';
  sensorList.style.paddingRight = '20px';
  sensorList.style.paddingLeft = '20px';
  sensorList.style.paddingTop = '10px';
  sensorList.style.flexDirection = 'column';
  sensorList.style.alignItems = 'center';
  sensorList.style.gridTemplateColumns = 'repeat(2, minmax(100px, 2fr))';
  sensorList.style.justifyContent = 'center';
  sensorList.style.cursor = 'pointer';
  sensorList.style.transition = 'background-color 200ms';
  sensorContainer.appendChild(sensorList);

  if (BUILDING_DATA && SENSOR_DATA) { // Access the global sensorData object
    SENSOR_DATA
      .sort((a, b) => a.room_no - b.room_no)
      .forEach(sensor => {

        // ----- Sensor List Items ----- //
        const sensorListItem = document.createElement('div');
        sensorListItem.id = 'wayfinder-sensorListItem';
        sensorListItem.style.display = 'flex';
        sensorListItem.style.flexDirection = 'row';
        sensorListItem.style.alignContent = 'center';
        sensorListItem.style.width = '100%';
        sensorListItem.style.height = '30px';
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
        // ----- ----- //

        // ----- Map Senors ----- //
        const mapSensor = document.createElement('div');
        mapSensor.id = 'wayfinder-mapSensor';
        mapSensor.innerText = sensor.room_no;
        mapSensor.style.fontSize = '1.5vh';
        mapSensor.style.position = 'absolute';
        mapSensor.style.backgroundColor = 'rgba(0, 175, 254, 0.8)';
        mapSensor.style.left = `${sensor.pos_x}%`;
        mapSensor.style.top = `${sensor.pos_y}%`;
        mapSensor.style.width = '1.8vh';
        mapSensor.style.height = '1.8vh';
        mapSensor.style.borderRadius = '100%';
        mapSensor.style.color = 'white';
        mapSensor.style.display = 'flex';
        mapSensor.style.alignItems = 'center';
        mapSensor.style.cursor = 'pointer';
        mapSensor.style.justifyContent = 'center';
        mapSensor.addEventListener('click', () => handleSensorClick(sensor));
        floorMapContainer.appendChild(mapSensor);

      });
  } else {
    console.error("sensorData is not defined or missing 'sensors'");
  }

  // -----  ----- //

  // ----- QR Code Container ----- //

  const qrCodeSection = document.createElement('div');
  qrCodeSection.id = 'wayfinder-qrCodeSection';
  qrCodeSection.style.width = '20%';
  qrCodeSection.style.display = 'flex';
  qrCodeSection.style.flexDirection = 'column';
  qrCodeSection.style.alignItems = 'center';
  qrCodeSection.style.justifyContent = 'center';
  bottomContainer.appendChild(qrCodeSection);

  // ========== ========== //

}

// ========== GLOBAL FUNCTIONS ========== //
window.renderPortraitWayfinder = renderPortraitWayfinder;
// ==========  ========== //
