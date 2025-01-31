import * as d3 from 'd3';
import { extend } from './helpers';
import QRCode from 'qrcode';

/**
 * Creates a floor plan mapper (areas and sensors)
 * @param {String} wrapper Mapper wrapper ID
 * @param {Object} data Floor plan data
 * @param {Object} options Mapper configurations & callback functions
 */
class Mapper {
	constructor(wrapper, data, options) {
		const container = d3.select(wrapper);
		const config_defaults = {
			sensorColors: ['#2398FF', '#808080', '#808080'],
			edit: false,
			heatmap: false,
			wayFinding: false,
			heatmapColors: [
				'#808080', '#3699fd', '#9db07b', '#ffca00', '#ea6603', '#c90607'
			],
			heatmapDomain: [0, 0.1, 20, 20.9, 40, 40.9, 60, 60.9, 80, 80.9, 100],
			comfortmap: false,
			comfortType: 'temp',
			tempColors: ['#FF8600', '#01FE01', '#0998ff'],
			airQualityColors: ['#0998ff', '#01fe01', '#fdd835', '#ff8600', '#ff5722', '#d60101'],
			tooltip: true,
			maxTemp: 100,
			filters: {
				desks: true,
				meetingRooms: true,
				phoneBooths: true
			}
		};
		const baseCounterFontSize = 11;

		let maxWidth = () => 1200, maxHeight = () => 600;
		let calcBaseSensorSize = () => {
			const base = config.sensorSize || 5;
			const { clientWidth, clientHeight } = document.body;

			if (clientWidth > 1920 && clientHeight > 1080) {
				return base * Math.min(clientWidth / 1920, clientHeight / 1080);
			}
			return base;
		};

		let width = maxWidth(), height = maxHeight();
		let _floor = data, sensors = _floor.sensors || [];
		let config = extend(config_defaults, options);
		let events = config.events;
		let offset = { x: 0, y: 0, scale: 0 };
		let tooltipOffsetX = 15;
		let state = {
			sensorMapping: false, showSensors: false,
			areaMapping: false, showAreas: false,
			drawing: false, polyMoved: false
		};
		let drawPoints = [];
		let size = calcBaseSensorSize();
		let sizeDelta = {
			desk: 0,
			room: 0,
		};

		let sensorSize = (s) => {
			if (config.heatmap) return size * (s.counter ? 2.5 : 1.2);
			if (config.comfortmap) return size * (s.counter ? 8 : 7);
			return (s.counter || s.is_primary_display ? size * 1.9 : size) + (s.roomSensor || s.is_way_finding ? sizeDelta.room : sizeDelta.desk);
		};

		let blurSize = () => config.heatmap ? 2 : 15;

		let xDMax = 50.0, yDMax = 33.79;
		let x = d3.scaleLinear().domain([0, xDMax]).range([0, width]);
		let y = d3.scaleLinear().domain([0, yDMax]).range([0, height]);
		let _ = this;

		let firstHeight = y(0 + yDMax) - y(0);
		let firstWidth = x(0 + xDMax) - x(0);
		console.log('First Height and Width:', firstHeight, firstWidth);

		let screenWidth = screen.width;
		let screenHeight = screen.height;
		console.log('Screen Width & Height:', screenWidth, screenHeight);

		let outputWidth = 0;
		let outputHeight = 0;

		if (screenHeight > 800 && screenWidth > 800) {
			outputHeight = firstHeight;
			outputWidth = firstWidth;
		} else {
			outputWidth = 352;
			outputHeight = 300;
		};

		const sensorColor = d3.scaleOrdinal().domain([0, 1, 2]).range(config.sensorColors);
		const sensorStroke = d3.scaleOrdinal().domain([0, 1, 2]).range(config.sensorColors);

		container.selectAll('svg').remove();
		container.selectAll('.tooltip').remove();

		// ----- Legend Click ----- //
		const legendLabels = document.querySelectorAll('.layout-legend__item-label');

		// Add click event listeners to each label
		legendLabels.forEach((label) => {
			label.addEventListener('click', (event) => {
				// Get the text content of the clicked label
				const name = event.target.textContent.trim();
				console.log('Portrait wayfinding Lengend:', name);
			});
		});




		const tooltip = container.append('div').attr('class', 'tooltip');
		const svg = container
			.append('svg')
			.attr('width', 500)
			.attr('height', 400)
			.style('display', 'block')
			.style('background', 'transparent')
			.on('click', function () {
				console.log("Clicked SVG");
				if (!config.edit) return;

				let evt = d3.event, elem = document.elementFromPoint(evt.x, evt.y);

				if (elem.tagName === 'svg') return;

				let t = mapLayer.__transform,
					_x = (t ? (evt.offsetX - t.x) / t.k : evt.offsetX) - offset.x,
					_y = (t ? (evt.offsetY - t.y) / t.k : evt.offsetY) - offset.y;

				if (state.sensorMapping) {
					let area = elem.tagName === 'polygon' ? d3.select(elem.parentNode).data()[0] : null;
					return events && events.sensorAdd && events.sensorAdd.call(_, { x: _x, y: _y, scale: offset.scale, area });
				}
			});

		if (config.livePulse) svg.attr('class', 'live-pulse');

		if (config.events) {
			svg.style('pointer-events', 'all');
		}

		if (config.heatmap || config.comfortmap) {
			svg.append("defs")
				.append("filter")
				.attr("id", "blur").attr('x', '-50%').attr('y', '-50%')
				.attr('width', '200%').attr('height', '200%')
				.append("feGaussianBlur")
				.attr("stdDeviation", blurSize());
		}

		const mapLayer = svg.selectAll('.map-layer').data([0])
			.enter().append('g').attr('class', 'map-layer');

		const imgLayer = mapLayer.append('g').attr('class', 'image-layer');
		const routeLayer = mapLayer.append('g').attr('class', 'route-layer');
		const sensorLayer = mapLayer.append('g').attr('class', 'sensor-layer');

		const zoom = d3.zoom().scaleExtent([1, 8])
			.on('zoom', () => {
				mapLayer.__transform = d3.event.transform;

				let minXTranslate = (1 - mapLayer.__transform.k) * (x.range()[1] - x.range()[0]),
					minYTranslate = (1 - mapLayer.__transform.k) * (y.range()[1] - y.range()[0]);

				mapLayer.__transform.x = Math.min(x.range()[0], Math.max(mapLayer.__transform.x, minXTranslate));
				mapLayer.__transform.y = Math.min(y.range()[0], Math.max(mapLayer.__transform.y, minYTranslate));

				imgLayer.attr('transform', mapLayer.__transform);
				routeLayer.attr('transform', mapLayer.__transform);
				sensorLayer.attr('transform', mapLayer.__transform);
			});

		mapLayer.call(zoom);

		function setSize(w, h) {
			width = w;
			height = h;

			x = d3.scaleLinear().domain([0, xDMax]).range([0, w]);
			y = d3.scaleLinear().domain([0, yDMax]).range([0, h]);
			svg.attr('width', w).attr('height', h);
		}

		function getImageDim(src, cb) {
			let img = new Image();

			if (events && events.imgLoad) events.imgLoad.call(this, src);

			img.src = src;
			img.onload = () => {
				let max_height = maxHeight(), max_width = maxWidth(),
					scale = img.height > max_height ? (max_height / img.height) : (max_width / img.width),
					canvasWidth = Math.min(Math.min(img.width * scale, img.width), max_width),
					canvasHeight = Math.min(Math.min(img.height * scale, img.height), max_height);

				setSize(canvasWidth, canvasHeight);

				if (events && events.imgLoaded) events.imgLoaded.call(this, img);

				return cb && cb({ height: img.height, width: img.width });
			};
		}

		function calcOffsets(cb) {
			getImageDim(_floor.floor_plan_url, dim => {
				let diff = { h: outputHeight - dim.height, w: outputWidth - dim.width },
					scale = diff.h < diff.w ? (outputHeight / dim.height) : (outputWidth / dim.width),
					imgWidth = dim.width * scale,
					imgHeight = dim.height * scale,
					imgOffsetX = (outputWidth - imgWidth) / 2,
					imgOffsetY = (outputHeight - imgHeight) / 2;

				offset.x = imgOffsetX < 0 ? 0 : imgOffsetX;
				offset.y = imgOffsetY < 0 ? 0 : imgOffsetY;
				offset.scale = scale;

				if (cb) cb();
			});
		}

		function setTooltip(x, y, content) {
			let bodyWidth = document.body.clientWidth;

			if (content) tooltip.html(content);
			if (x < 0) x = 0;
			if (x > bodyWidth) x = x - Math.abs(bodyWidth - x);

			tooltip.style('left', `${x}px`)
				.style('top', `${y}px`);
		}

		let timeout;
		let DEFAULT_RADIUS = 9.9;
		let SELECTED_RADIUS = 20;
		let selectedSensorId = null;

		function resetSensorRadius() {
			if (selectedSensorId) {
				d3.select(`[data-id="${selectedSensorId}"]`).attr('r', DEFAULT_RADIUS);
				selectedSensorId = null;
			}
		}

		function setNodeDetails(sensor, newUrl) {

			if (sensor) {
				d3.selectAll('circle')
					.each(function () {
						const sensorId = d3.select(this).attr('data-id');
						if (sensorId !== sensor.id) {
							d3.select(this).attr('r', DEFAULT_RADIUS);
						}
					});
			}

			if (newUrl.includes('way-finding')) {
				newUrl = newUrl.replace('way-finding', 'qr-wayfind');
			}

			console.log('Sensor Structure: ', sensor, newUrl);
			const detailsDiv = document.getElementById('qr-section');
			const qrDiv = document.getElementById('qr-block');

			if (!detailsDiv) {
				const newDiv = document.createElement('div');
				newDiv.id = 'qr-section';
				newDiv.style.position = 'absolute';
				newDiv.style.padding = '10px';
				newDiv.style.background = '#fff';
				newDiv.style.border = '1px solid #ccc';
				newDiv.style.zIndex = '9999';
				document.body.appendChild(newDiv);
			}

			const content = `
                    <h3><b>Selected Room:</b> ${sensor.name} </h3>
                    <h3><b>Room Status: </b> ${sensor.sensor_state} </h3>
				`;
			detailsDiv.innerHTML = content;

			if (newUrl.includes('way-finding')) {
				newUrl = newUrl.replace('way-finding', 'qr-wayfind');
			}

			console.log('New Link Generated After click:', newUrl);
			let qrcode = QRCode.toCanvas(qrDiv, newUrl);

			const { pos_x, pos_y, scale } = sensor;
			const offsetX = pos_x * scale;
			const offsetY = pos_y * scale;

			detailsDiv.style.left = `${offsetX}px`;
			detailsDiv.style.top = `${offsetY}px`;

			detailsDiv.style.display = 'block';
			qrDiv.style.display = 'block';

			let imageToRemove = routeLayer.select('image');

			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(() => {
				console.log('clear 1');
				resetSensorRadius();

				detailsDiv.style.display = 'none';
				qrDiv.innerHTML = '';
				qrDiv.style.display = 'none';

				// Clear the href attribute and remove the image element
				imageToRemove.attr('xlink:href', "");
				imageToRemove.remove();

				// Remove the image from the routeLayer
				let imageToRemove2 = routeLayer.select('image');
				imageToRemove2.remove();

				// Reset the radius back to default
				selectedSensorId = null; // Reset the selectedSensorId
			}, 15000);
		}


		function handleSensorClick(s, newUrl) {

			console.log('Sensor Clicked');
			selectedSensorId = s.id;
			setNodeDetails(s, newUrl);
			return events && events.sensorClick && events.sensorClick.call(_, s);
		}


		function sensorDrag(s) {
			if (config.edit && state.sensorMapping) {
				s.dragged = true;
				d3.select(this)
					.attr('cx', s.pos_x = d3.event.x)
					.attr('cy', s.pos_y = d3.event.y);

				if (s.counter) {
					d3.select(this.parentNode).select('text')
						.attr('dx', s.pos_x = d3.event.x)
						.attr('dy', s.pos_y = d3.event.y);
				}
			}
		}

		function sensorDragEnd(s) {
			if (config.edit && state.sensorMapping && s.dragged) {
				s.dragged = false;
				s.pos_x -= offset.x;
				s.pos_y -= offset.y;
				s.scale = offset.scale;
				return events && events.sensorMoved && events.sensorMoved.call(_, s);
			}
			selectedSensorId = null; // Reset the selectedSensorId
		}


		function sensorColorIdx(state) {
			return ['available', 'occupied', 'standby'].indexOf(state);
		}

		this.drawFloorPlan = function () {
			imgLayer.selectAll('image').remove();
			routeLayer.selectAll('image').remove();

			if (mapLayer.__transform) {
				imgLayer.attr('transform', mapLayer.__transform);
				routeLayer.attr('transform', mapLayer.__transform);
			}

			if (_floor.floor_plan) {
				let canClick = config.edit && (state.sensorMapping || state.areaMapping);

				imgLayer.insert('image', ':first-child')
					.attr('xlink:href', _floor.floor_plan_url)
					.attr('height', outputHeight)
					.attr('width', outputWidth)
					.style('cursor', () => canClick ? 'crosshair' : 'default');

				var svgElement = document.querySelector('.live-pulse');

				if (svgElement) {
					svgElement.setAttribute('width', outputWidth);
					svgElement.setAttribute('height', outputHeight);
				} else {
					console.error('SVG element with class "live-pulse" not found.');
				}

				if (config.wayFinding) imgLayer.select('image').attr('filter', 'invert(1)');
			}
		};

		this.drawSensors = function (livePulse = false, type = 'all') {
			if (['all', 'room'].indexOf(type) >= 0) {
				sensorLayer.selectAll('.room-sensor').remove();
				sensorLayer.selectAll('.meeting-room').remove();
				sensorLayer.selectAll('.phone-booth').remove();
			}
			if (['all', 'desk'].indexOf(type) >= 0) sensorLayer.selectAll('.desk-sensor').remove();

			if (mapLayer.__transform) sensorLayer.attr('transform', mapLayer.__transform);

			if (sensors.length === 0) return;

			let canEdit = config.edit && state.sensorMapping;
			let deskSensors = sensors.filter(s => !s.counter && !s.roomSensor && !s.is_way_finding && (config.live ? !s.hideOnLive : true));
			let mrSensors = sensors.filter(s => (s.mrSensor && !s.is_way_finding && (config.live ? !s.hideOnLive : true)) || (s.is_way_finding && (config.live ? s.is_primary_display : true)));
			let boothSensors = sensors.filter(s => s.boothSensor && (config.live ? !s.hideOnLive : true));
			let preSelectedSensorId = "";
			let preSelectedSensor;

			function addCircle(g) {
				let previouslySelectedSensorCircle = null;
				g.append('circle')
					.attr('class', d => {
						let cssClass = d.roomSensor || d.is_way_finding ? 'room-sensor' : 'desk-sensor';
						return livePulse ? `sensor ${cssClass} ${d.sensor_state}` : `sensor ${cssClass}`;
					})
					.attr('data-id', d => d.id)
					.attr('r', DEFAULT_RADIUS)
					.attr('stroke-width', livePulse || config.heatmap || config.comfortmap ? null : 5)
					.attr('stroke', d => {
						return (!livePulse || config.heatmap || config.comfortmap) ? null :
							sensorStroke(sensorColorIdx(d.sensor_state));
					})
					.style('fill', d => {
						return config.heatmap ? heatColor(d.temp) :
							config.comfortmap ? (config.comfortType == 'temp' ? temperatureColor(d.temp) : airQualityColor(d.co2ppm)) :
								sensorColor(sensorColorIdx(d.sensor_state));
					})
					.style('opacity', d => config.comfortmap ? 0.75 : null)
					.style('pointer-events', d => config.comfortmap ? 'none' : null)
					.attr("filter", config.heatmap || config.comfortmap ? "url(#blur)" : null)
					.style('cursor', function () { return canEdit ? 'move' : 'default'; })
					.attr('cx', s => {
						let cxValue = ((s.pos_x / s.scale) * offset.scale) + offset.x;
						return isNaN(cxValue) ? 0 : cxValue;
					})
					.attr('cy', s => {
						let cyValue = ((s.pos_y / s.scale) * offset.scale) + offset.y;
						return isNaN(cyValue) ? 0 : cyValue;
					})
					.on('mouseover', function () {
						if (!config.tooltip) return;
						if (config.comfortmap) return;
						let s_circle = d3.select(this), s = sensors.find(x => x.id === s_circle.attr('data-id'));

						if (!config.heatmap) s_circle.classed('hovered', true);
						tooltip.transition().duration(200).style('opacity', 0.95);

						let ttRect = tooltip.node().getBoundingClientRect();
						let tooltipX = d3.event.pageX - (ttRect.width / 2);
						let tooltipY = d3.event.pageY - (ttRect.height + 10) - window.scrollY;

						setTooltip(tooltipX, tooltipY,
							`<div>ID: ${s.sensor_id}</div>
                            <div>Name: ${s.name ? s.name : '(None)'}</div>
                            <div>Area: ${s.parent}</div>`);
					})
					.on('mousemove', function () {
						if (!config.tooltip) return;
						if (config.comfortmap) return;

						let ttRect = tooltip.node().getBoundingClientRect();
						let tooltipX = d3.event.pageX - (ttRect.width / 2);
						let tooltipY = d3.event.pageY - (ttRect.height + 10) - window.scrollY;

						setTooltip(tooltipX, tooltipY);
					})
					.on('mouseout', function () {
						if (!config.tooltip) return;
						if (config.comfortmap) return;

						if (!config.heatmap) d3.select(this).classed('hovered', false);
						tooltip.transition().duration(200).style('opacity', 0);
					})
					.on('click', function () {
						let s_circle = d3.select(this), s = sensors.find(x => x.id === s_circle.attr('data-id'));

						if (previouslySelectedSensorCircle !== null) {
							resetSensorRadius();
						}

						s_circle.attr('r', SELECTED_RADIUS);

						previouslySelectedSensorCircle = s_circle;

						let existingImage = routeLayer.select('image');
						if (!existingImage.empty()) {
							existingImage.remove();
						}
						// image from the sensorData
						routeLayer.insert('image', ':first-child')
							.attr('xlink:href', "/plans/" + s.name + ".png")
							.attr('height', outputHeight)
							.attr('width', outputWidth);

						let imageToRemove = routeLayer.select('image');

						let currentURL = window.location.href;
						let url = new URL(currentURL);

						if (url.pathname.includes('way-finding')) {
							url.pathname = url.pathname.replace('way-finding', 'qr-wayfind');
						}

						let newURL2 = url.toString();
						var sensorId = s.id;

						url.searchParams.append('clickedSensor', 'fbd676b0-c82a-473a-871f-715245583c85');
						var newURL3 = newURL2 + "&clickedSensor=" + sensorId;

						handleSensorClick(s, newURL3);
					})
					.call(d3.drag()
						.on('drag', sensorDrag)
						.on('end', sensorDragEnd));

				let previouslySelectedSensorId = null;

				for (let i = 0; i < sensors.length; i++) {
					let s = sensors[i];
					let element = document.getElementById(s.id);

					if (element) {
						let clickFunction = function () {
							if (previouslySelectedSensorId !== null) {
								resetSensorRadius();
							}

							d3.select(`[data-id="${s.id}"]`).attr('r', SELECTED_RADIUS);

							var currentURL = window.location.href;
							var sensorId = s.id;

							var newURL = currentURL + "&clickedSensor=" + sensorId;

							handleSensorClick(s, newURL);

							previouslySelectedSensorId = s.id;

							let existingImage = routeLayer.select('image');
							if (!existingImage.empty()) {
								existingImage.remove();
							}

							routeLayer.insert('image', ':first-child')
								.attr('xlink:href', "/plans/" + s.name + ".png")
								.attr('id', 'currentRoute')
								.attr('height', outputHeight)
								.attr('width', outputWidth);

							let imageToRemove = routeLayer.select('image');
							const detailsDiv = document.getElementById('qr-section');
							const qrDiv = document.getElementById('qr-block');

							// Store the reference to the element
							let s_circle = d3.select(this);

							if (timeout) clearTimeout(timeout);

							timeout = setTimeout(() => {
								console.log("clear 2")
								detailsDiv.style.display = 'none';
								qrDiv.innerHTML = '';
								qrDiv.style.display = 'none';

								// Reset the radius back to default
								resetSensorRadius();

								imageToRemove.remove();
								resetSensorRadius();
							}, 15000);
						};

						element.onclick = clickFunction;

						let parentElement = element.parentElement;
						if (parentElement) {
							parentElement.onclick = clickFunction;
						}
					}
				}

				var currentURL = window.location.href;

				var match = currentURL.match(/[?&]clickedSensor=([^&]*)/);
				var extractedSensorId = match ? match[1] : null;

				if (extractedSensorId !== null && extractedSensorId !== "") {
					preSelectedSensorId = extractedSensorId;
					var s = sensors.find(x => x.id == extractedSensorId);
					preSelectedSensor = s;
				}
			}

			function addText(g) {
				g.append('text')
					.attr('data-id', s => s.id)
					.attr('class', 'sensor-counter')
					.attr('font-size', `${baseCounterFontSize}px`)
					.attr('dominant-baseline', 'central')
					.text(s => s.is_way_finding ? s.room_no : s.count_status)
					.attr('r', s => sensorSize(s))
					.attr('dx', s => {
						let scale = parseFloat(offset.scale.toFixed(12));
						let cxValue = ((s.pos_x / s.scale) * scale) + offset.x;

						return isNaN(cxValue) ? 0 : cxValue;
					})
					.attr('dy', s => {
						let scale = parseFloat(offset.scale.toFixed(12));
						let cyValue = ((s.pos_y / s.scale) * scale) + offset.y;

						return isNaN(cyValue) ? 0 : cyValue;
					})
					.each(function (s) {
						const { width, height } = this.getBBox();
						const circle = d3.select(this.parentNode).select('.room-sensor').node();
						const { width: circleWidth, height: circleHeight } = circle.getBBox();
						const pad = 0.4;
						const padding = { x: circleWidth * pad, y: circleHeight * pad };
						const scale = Math.min((circleWidth - padding.x) / width, (circleHeight - padding.y) / height);

						s.fontSize = baseCounterFontSize * scale;
					})
					.attr('font-size', s => `${s.fontSize}px`);
			}

			function addRoomSensors(sensors, counterClass) {
				let virtuals = sensors.filter(x => !x.counter && !x.is_primary_display);
				let virtuals_g = sensorLayer.selectAll(null)
					.data(virtuals)
					.enter();

				addCircle(virtuals_g);

				let counters = sensors.filter(x => x.counter || x.is_primary_display);
				let counters_g = sensorLayer.selectAll(null)
					.data(counters)
					.enter()
					.append('g')
					.attr('class', counterClass);

				addCircle(counters_g);
				if (!config.heatmap && !config.comfortmap) addText(counters_g);
			}

			if (['all', 'desk'].indexOf(type) >= 0 && config.filters.desks) {
				let desks = sensorLayer.selectAll(null)
					.data(deskSensors)
					.enter();

				addCircle(desks);
			}

			if (['all', 'room'].indexOf(type) >= 0 && (config.filters.meetingRooms || config.filters.phoneBooths)) {
				if (config.filters.meetingRooms) addRoomSensors(mrSensors, 'meeting-room');

				if (config.filters.phoneBooths) addRoomSensors(boothSensors, 'phone-booth');
			};

			console.log('Access to the main data:', data);

			var currentURL = window.location.href;

			var match = currentURL.match(/[?&]clickedSensor=([^&]*)/);
			var extractedSensorId = match ? match[1] : null;

			if (extractedSensorId !== null && extractedSensorId !== "") {
				preSelectedSensorId = extractedSensorId;

				let s = data.sensors.find(x => x.id == preSelectedSensorId);
				console.log('The found sensor is:', s);

				d3.select(`[data-id="${s.id}"]`).attr('r', SELECTED_RADIUS);

				var currentURL = window.location.href;
				var sensorId = s.id;

				var newURL = currentURL;

				handleSensorClick(s, newURL);

				let existingImage = routeLayer.select('image');
				if (!existingImage.empty()) {
					existingImage.remove();
				}

				routeLayer.insert('image', ':first-child')
					.attr('xlink:href', "/plans/" + s.name + ".png")
					.attr('id', 'currentRoute')
					.attr('height', outputHeight)
					.attr('width', outputWidth);
			}
		};

		this.setSensorColor = function (id, status) {
			let range = sensorColorIdx(status);

			sensorLayer.select(`.sensor[data-id="${id}"]`)
				.style('fill', sensorColor(range))
				.attr('stroke', sensorStroke(range))
				.classed('occupied', status == 'occupied')
				.classed('available', status == 'available')
				.classed('standby', status == 'standby');
		};

		this.setSensorCounter = function (id, count) {
			sensorLayer.select(`.sensor-counter[data-id="${id}"]`)
				.text(count);
		};

		this.getSensorDelta = function (type) {
			return sizeDelta[type];
		};

		this.setSensorDelta = function (type, delta) {
			sizeDelta[type] = delta;
		};

		this.setSensorSize = function (type, size) {
			let delta = sizeDelta[type];
			let newDelta = size == 'smaller' ? delta - 0.6 : size == 'bigger' ? delta + 0.6 : delta;
			sizeDelta[type] = newDelta;
		};

		this.setFilters = function (filters) {
			config = extend(config, { filters });
		};

		this.setComfortType = function (type) {
			config.comfortType = type;
		};

		this.setData = function (data, livePulse = false) {
			_floor = data;
			sensors = _floor.sensors;
			mapLayer.__transform = null;

			this.redraw(true, livePulse);
		};

		this.redraw = function (fresh, livePulse = false) {
			setSize(10, 10);

			if (!_floor.floor_plan) {
				imgLayer.selectAll('image').remove();
				routeLayer.selectAll('image').remove();
				sensorLayer.selectAll('.sensor').remove();
				return;
			}

			if (fresh) {
				size = calcBaseSensorSize();
				mapLayer.__transform = null;
				mapLayer.call(zoom.transform, d3.zoomIdentity);
			}

			calcOffsets(() => {
				this.drawFloorPlan();
				this.drawSensors(livePulse);
			});

			this.clearDrawing();
		};

		this.editMode = function (edit) {
			config.edit = edit;
			this.redraw(false);
		};

		this.setAreaMapping = function (enable) {
			if (enable) state.sensorMapping = false;
			state.areaMapping = enable;
			this.redraw(false);
		};

		this.clearDrawing = function () {
			state.drawing = false;
			drawPoints.splice(0);
		};

		this.setSensorMapping = function (enable) {
			if (enable) state.areaMapping = false;
			state.sensorMapping = enable;
			this.redraw(false);
		};

		this.searchSensor = function (query) {
			let hiddenClass = 'search--hidden';
			if (query == '') {
				sensorLayer.selectAll('.sensor')
					.classed(hiddenClass, false);
			} else {
				sensorLayer.selectAll(`.sensor`)
					.each(function (d) {
						let id = d.sensor_id.toLowerCase();
						let parent = d.parent.toLowerCase();
						let matched = id.indexOf(query) >= 0 || parent.indexOf(query) >= 0;

						d3.select(this).classed(hiddenClass, !matched);
					});
			}
		};

		if (_floor && _floor.floor_plan) {
			calcOffsets(() => {
				this.drawFloorPlan();
				this.drawSensors();
			});
		}

		return this;
	}
}

export default Mapper;
