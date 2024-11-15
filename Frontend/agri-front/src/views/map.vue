<template>
    <div id="app">
      <div id="map" ref="map"></div>
      <!-- Popup element -->
      <div id="popup" ref="popup" class="ol-popup">
        <button class="popup-close-button" @click="closePopup">×</button>
        <div class="popup-content" ref="popupContent"></div>
      </div>
    </div>
  </template>
  
  <script>
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import { OSM } from 'ol/source';
  import TileLayer from 'ol/layer/Tile';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import { Point } from 'ol/geom';
  import { Feature } from 'ol';
  import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
  import { fromLonLat } from 'ol/proj';
  import Overlay from 'ol/Overlay';
  
  export default {
    name: 'MapPage',
    data() {
      return {
        map: null,
        overlay: null,
        points: [
          { id: 1, name: 'Sensor 1', coords: [116.4074, 39.9042], description: 'This is Sensor 1 in Beijing.' },
          { id: 2, name: 'Sensor 2', coords: [-0.1276, 51.5074], description: 'This is Sensor 2 in London.' },
          { id: 3, name: 'Sensor 3', coords: [139.6917, 35.6895], description: 'This is Sensor 3 in Tokyo.' },
        ],
        initialCenter: null
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        // Create the map
        if (this.points.length > 0) {
      this.initialCenter = this.points[0].coords;
    }
 
    // Create the map
    this.map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(this.initialCenter),
        zoom: 5, // 可以根据需要调整初始缩放级别
      }),
    });
  
        // Create a vector source and layer for the points
        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: this.pointStyle,
        });
        this.map.addLayer(vectorLayer);
  
        // Create overlay for popup
        this.overlay = new Overlay({
          element: this.$refs.popup,
          positioning: 'bottom-center',
          stopEvent: true,
          offset: [0, -15],
        });
        this.map.addOverlay(this.overlay);
  
        // Add points to the map
        this.points.forEach((point) => {
          const feature = new Feature({
            geometry: new Point(fromLonLat(point.coords)),
            name: point.name,
            description: point.description,
          });
          vectorSource.addFeature(feature);
        });
  
        // Add click event to display point details
        this.map.on('singleclick', (event) => {
          this.overlay.setPosition(undefined); // Hide any open popup
          this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
            const coordinates = feature.getGeometry().getCoordinates();
            const description = feature.get('description');
            const name = feature.get('name');
            this.$refs.popupContent.innerHTML = `<strong>${name}</strong><br>${description}`;
            this.overlay.setPosition(coordinates);
          });
        });
      },
      pointStyle(feature) {
        return new Style({
          image: new Icon({
            src: 'https://openlayers.org/en/v6.5.0/examples/data/icon.png',
            scale: 0.5,
          }),
          text: new Text({
            text: feature.get('name'),
            offsetY: -30,
            font: 'bold 14px Arial',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
          }),
        });
      },
      closePopup() {
        this.overlay.setPosition(undefined); // Hide the popup
      },
    },
  };
  </script>
  
  <style scoped>
  /* Flexbox centering for #app */
  html, body, #app {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  /* Centered map container with fixed size */
  #map {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  /* Popup styling */
  .ol-popup {
    position: absolute;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #333;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    min-width: 100px;
    white-space: nowrap;
  }
  
  /* Close button styling */
  .popup-close-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  
  .ol-popup::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
  
  .popup-content {
    font-size: 14px;
    color: #333;
    padding-top: 10px; /* Add padding to avoid overlap with close button */
  }
  </style>
  