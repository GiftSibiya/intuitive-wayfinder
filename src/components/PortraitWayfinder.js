// PortraitWayfinder.js
async function renderPortraitWayfinder(container, props) {



  
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
  topContainer.style.height = '55%';
  topContainer.style.display = 'flex';
  topContainer.style.justifyContent = 'center';
  topContainer.style.backgroundColor = 'black';
  mainContainer.appendChild(topContainer);

  const floorMapContainer = document.createElement('div');
  floorMapContainer.id = 'wayfinder-floorMapContainer';
  floorMapContainer.style.width = '100%';
  floorMapContainer.style.height = '100%';
  topContainer.appendChild(floorMapContainer);

  const floorMapImage = document.createElement('img');
  floorMapImage.src = './src/assets/images/plans/hibfVty6hjiERxZ28K8FPnCDWbZdrmjtlFvpMdgU.jpg';
  floorMapImage.style.width = '65%';
  floorMapImage.style.height = '100%';
  floorMapImage.style.objectFit = 'contain';
  floorMapImage.style.backgroundColor = 'black';
  floorMapImage.style.color = 'black';
  floorMapContainer.appendChild(floorMapImage);

  // -----  ----- //
  
  const bottomContainer = document.createElement('div');
  bottomContainer.id = 'wayfinder-bottomContainer';
  bottomContainer.style.display = 'flex';
  bottomContainer.style.flexDirection = 'row';
  bottomContainer.style.width = '100%';
  bottomContainer.style.height = '45%';
  mainContainer.appendChild(bottomContainer);

  //----- Sensor Container ----- //

  // Lenegd Container
  const legendContainer = document.createElement('div');
  legendContainer.id = 'wayfinder-legendContainer';
  legendContainer.style.width = '15%';
  legendContainer.style.height = '100%';
  legendContainer.style.border = '1px solid white';
  bottomContainer.appendChild(legendContainer);

  const lengendText = document.createElement('h3');
  lengendText.textContent = 'Legend';
  lengendText.style.color = 'white';
  legendContainer.appendChild(lengendText);

  // 

  const sensorContainer = document.createElement('div');
  sensorContainer.id = 'wayfinder-sensorContainer';
  sensorContainer.style.width = '70%';
  sensorContainer.style.height = '100%';
  bottomContainer.appendChild(sensorContainer);

  const sensorTitleContainer = document.createElement('div');
  sensorTitleContainer.id = 'wayfinder-sensorTitle';
  sensorTitleContainer.style.width = '100%';
  sensorTitleContainer.style.height = '20%';
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
  searchContainer.style.height = '40px';
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

  // const sensorList = document.createElement('div');
  // sensorList.id = 'wayfinder-sensorList';
  // sensorList.style.width = '100%';
  // sensorList.style.height = '50%';
  // sensorList.style.display = 'flex';
  // sensorList.style.flexDirection = 'column';
  // sensorList.style.alignItems = 'center';
  // sensorList.style.justifyContent = 'center';
  // sensorList.style.border = '1px solid red';
  // sensorContainer.appendChild(sensorList);

  const sensorList = document.createElement('div');
  sensorList.id = 'wayfinder-sensorList';
  sensorList.style.width = '100%';
  sensorList.style.height = '50%';
  sensorList.style.display = 'flex';
  sensorList.style.flexDirection = 'column';
  sensorList.style.alignItems = 'center';
  sensorList.style.justifyContent = 'center';
  sensorList.style.border = '1px solid red';
  sensorContainer.appendChild(sensorList);

  // Access the global sensorData object
  if (window.sensorData && window.sensorData.sensors) {
    window.sensorData.sensors
      .sort((a, b) => a.room_no - b.room_no)
      .forEach(sensor => {

      const sensorListItem = document.createElement('div');
      sensorListItem.id = 'wayfinder-sensorListItem';
      sensorListItem.style.display = 'flex';
      sensorListItem.style.flexDirection = 'row';
      sensorListItem.style.width = '100%';
      sensorListItem.style.height = '50px';
      sensorListItem.style.borderColor = '1px solid red';
      
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
      sensorNumber.style.color = 'white';
      sensorNumber.style.borderRadius = '100%';
      sensorListItem.appendChild(sensorNumber);

      const sensorItem = document.createElement('div');
      sensorItem.id = 'wayfinder-sensorItem';
      sensorItem.textContent = sensor.name;
      sensorItem.style.color = 'white';
      sensorItem.style.display = 'flex';
      sensorItem.style.flexDirection = 'row';
      sensorItem.style.width = '80%';
      sensorItem.style.height = '100px';
      sensorListItem.appendChild(sensorItem);



      
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


  // Fetch the static sensor data

}


// Attach the function to the global window object
window.renderPortraitWayfinder = renderPortraitWayfinder;
