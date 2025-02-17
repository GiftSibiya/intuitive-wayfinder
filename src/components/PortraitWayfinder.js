// PortraitWayfinder.js
async function renderPortraitWayfinder(container, props) {

  // ========== Variables ========== //

  let wayfindTimeout; // Wayfinding Screen Timeout

  // ========== Functions ========== //


const handleSensorClick = (sensor) => {
    let wayfindDuration = 5000;
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
    sensorPic.style.transform = 'translate(-50%, -99%)'; // translate(X position, Y position) 
    sensorPic.style.width = '65%';
    sensorPic.style.height = '100%';
    sensorPic.style.objectFit = 'contain';
    sensorPic.style.backgroundColor = 'transparent';
    sensorPic.style.border = '2px solid #007bff';
    sensorPic.style.pointerEvents = 'none';

    floorMapContainer.appendChild(sensorPic);

    wayfindTimeout = setTimeout(() => { // Start a new timeout
        if (document.getElementById('sensor-overlay')) {
            document.getElementById('sensor-overlay').remove();
        }
    }, wayfindDuration);
};



// ========== ========== //

// ========== UI COMPONENTS ========== //
  
  const mainContainer = document.createElement('div');
  mainContainer.id = 'wayfinder-mainContainer';
  mainContainer.style.width = '100%';
  mainContainer.style.height = '100%';
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
  floorMapContainer.style.position = 'relative';
  floorMapContainer.style.width = '100%';
  floorMapContainer.style.height = '100%';
  topContainer.appendChild(floorMapContainer);

  const floorMapImage = document.createElement('img');
  floorMapImage.src = './src/assets/images/plans/hibfVty6hjiERxZ28K8FPnCDWbZdrmjtlFvpMdgU.jpg';
  floorMapImage.style.width = '65%';
  floorMapImage.style.height = '100%';
  floorMapImage.style.objectFit = 'contain';
  floorMapImage.style.filter = 'invert(1)';
  floorMapImage.style.backgroundColor = 'transparent';
  floorMapImage.style.color = 'black';
  floorMapContainer.appendChild(floorMapImage);

  // -----  ----- //
  
  const bottomContainer = document.createElement('div');
  bottomContainer.id = 'wayfinder-bottomContainer';
  bottomContainer.style.display = 'flex';
  bottomContainer.style.flexDirection = 'row';
  bottomContainer.style.width = '100%';
  bottomContainer.style.height = '35%';
  mainContainer.appendChild(bottomContainer);

  //----- Sensor Container ----- //

  // Lenegd Container
  const legendContainer = document.createElement('div');
  legendContainer.id = 'wayfinder-legendContainer';
  legendContainer.style.width = '10%';
  legendContainer.style.height = '100%';
  bottomContainer.appendChild(legendContainer);

  const lengendText = document.createElement('h3');
  lengendText.textContent = 'Legend';
  lengendText.style.flex = 'flex';
  lengendText.style.color = 'white';
  lengendText.style.fontSize = '14px';
  lengendText.style.alignSelf = 'flex-start';
  legendContainer.appendChild(lengendText);

  if (window.sensorData && window.sensorData.legends) {
    window.sensorData.legends.forEach( legend => {

      const legendItem = document.createElement('div');
      legendItem.style.display = 'flex';
      legendItem.style.width = '100%';
      legendItem.style.height = '25px';
      legendItem.style.justifyContent = 'start';
      legendItem.style.color = 'white';
      legendItem.style.fontSize = '12px';
      legendItem.style.cursor = 'pointer';
      legendItem.innerHTML = legend.name;

      legendContainer.appendChild(legendItem);

      }
    )
  
  }

  // 

  const sensorContainer = document.createElement('div');
  sensorContainer.id = 'wayfinder-sensorContainer';
  sensorContainer.style.width = '70%';
  sensorContainer.style.height = '100%';
  bottomContainer.appendChild(sensorContainer);

  const sensorTitleContainer = document.createElement('div');
  sensorTitleContainer.id = 'wayfinder-sensorTitle';
  sensorTitleContainer.style.width = '100%';
  sensorTitleContainer.style.height = '35px';
  sensorTitleContainer.style.display = 'flex';
  sensorTitleContainer.style.padding = '10px';
  sensorTitleContainer.style.flexDirection = 'row';
  sensorTitleContainer.style.justifyContent = 'space-beween';
  sensorTitleContainer.style.alignItems = 'center';
  sensorContainer.appendChild(sensorTitleContainer);
  
  const titleImage = document.createElement('img');
  titleImage.src = './src/assets/images/logos/the-world-bank-logo.png';
  titleImage.style.width = '50px';
  sensorTitleContainer.appendChild(titleImage);

  const sensorTitleText = document.createElement('div');
  sensorTitleText.id = 'wayfinder-sensorTitleText';
  sensorTitleText.textContent = 'Floor Map';
  sensorTitleText.style.width = '20%';
  sensorTitleText.style.color = 'white';
  sensorTitleText.style.fontWeight = 'bold';
  sensorTitleText.style.alignItems = 'center';
  sensorTitleText.style.justifyContent = 'center';
  sensorTitleContainer.appendChild(sensorTitleText);

  //  Time Container

  const timeContainer = document.createElement('div');
  timeContainer.id = 'wayfinder-timeContainer';
  timeContainer.style.width = '70%';
  timeContainer.style.height = '100%';
  timeContainer.style.display = 'flex';
  timeContainer.style.flexDirection = 'column';
  timeContainer.style.alignItems = 'end';
  timeContainer.style.alignSelf = 'flex-end';
  timeContainer.style.justifyContent = 'center';
  sensorTitleContainer.appendChild(timeContainer);

  const timeText = document.createElement('div');
  timeText.id = 'wayfinder-timeText';
  const hour = new Date().getHours();
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  timeText.textContent = `${hour12}:${new Date().getMinutes().toString().padStart(2, '0')} ${ampm}`;
  timeText.style.color = 'white';
  timeText.style.fontWeight = 'bold';
  timeText.style.fontSize = '12px';
  timeText.style.alignItems = 'center';
  timeText.style.justifyContent = 'center';
  timeContainer.appendChild(timeText);

  const dateText = document.createElement('div');
  dateText.id = 'wayfinder-dateText';
  dateText.textContent = new Date().toDateString();
  dateText.style.color = 'white';
  dateText.style.fontWeight = 'bold';
  dateText.style.fontSize = '10px';
  dateText.style.alignItems = 'center';
  dateText.style.justifyContent = 'center';
  timeContainer.appendChild(dateText);

  // -----  ----- //

  // ----- Search Container ----- //
  
  const searchContainer = document.createElement('div');
  searchContainer.id = 'wayfinder-searchContainer';
  searchContainer.style.width = '100%';
  searchContainer.style.height = '35px';
  searchContainer.style.display = 'flex';
  searchContainer.style.flexDirection = 'column';
  searchContainer.style.alignItems = 'center';
  searchContainer.style.justifyContent = 'center';
  sensorContainer.appendChild(searchContainer);

  const searchInput = document.createElement('input');
  searchInput.id = 'wayfinder-searchInput';
  searchInput.type = 'text';
  searchInput.placeholder = 'search room name...';
  searchInput.style.width = '95%';
  searchInput.style.height = '100%';
  searchInput.style.padding = '10px';
  searchInput.style.border = '1px solid #ccc';
  searchInput.style.borderRadius = '50px';
  searchInput.style.backgroundColor = '#32313d';
  searchInput.style.padding = '5px';
  searchContainer.appendChild(searchInput);
  
  // -----  ----- //

  const sensorList = document.createElement('div');
  sensorList.id = 'wayfinder-sensorList';
  sensorList.style.width = '100%';
  sensorList.style.height = '60%';
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

  if (window.sensorData && window.sensorData.sensors) { // Access the global sensorData object
    window.sensorData.sensors
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
        mapSensor.style.position = 'absolute';
        mapSensor.style.backgroundColor = 'rgba(0, 175, 254, 0.8)';
        mapSensor.style.left = `${sensor.pos_x}%`;
        mapSensor.style.top = `${sensor.pos_y}%`;
        mapSensor.style.width = '20px';
        mapSensor.style.height = '20px';
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
  qrCodeSection.style.border = '1px solid red';
  bottomContainer.appendChild(qrCodeSection);




  // ========== ========== //

}


// ========== GLOBAL FUNCTIONS ========== //
window.renderPortraitWayfinder = renderPortraitWayfinder;
// ==========  ========== //