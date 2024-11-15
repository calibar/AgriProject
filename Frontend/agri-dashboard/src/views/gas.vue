<template>
    <div id="app">
      <HeaderBar></HeaderBar>
      <div class="container-fluid">
        <div class="row ">
        <div class="col-12 col-md-4"></div>

        <div class="col-12 col-md-6">
          <!-- 将地图放入 card 中，去掉 header，只显示地图 -->
          <div class="card custom-card">
            <div class="card-header">
              土壤传感器地图分布
            </div>
            <div class="card-body p-0"> <!-- 去掉卡片内边距 -->
              <div id="map" ref="map" style="width: 100%; height: 60vh;"></div> <!-- 设置地图的高度 -->
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2">
          <div class="card info-card">
    <div class="card-header">当前位置</div>
    <div class="card-body">
      <div class="info-item">
        <label>经度：</label>
        <span>{{ clickedCoords.lon }}</span>
      </div>
      <div class="info-item">
        <label>纬度：</label>
        <span>{{ clickedCoords.lat }}</span>
      </div>
      <div class="info-item">
        <label>所属省市：</label>
        <span>{{ locationDetails.province }}</span>
      </div>
      <div class="info-item">
        <label>县、乡镇：</label>
        <span>{{ locationDetails.town }}</span>
      </div>
    </div>
  </div>
  <div class="card soil-info-card">
      <div class="card-header">土质信息</div>
      <div class="card-body">
                  <div class="info-item">
                    <label>土壤类型：</label>
                    <span>黑土</span>
                  </div>
                  <div class="info-item">
                    <label>质地：</label>
                    <span>壤土或粘壤土</span>
                  </div>
                  <div class="info-item">
                    <label>结构：</label>
                    <span>团粒结构</span>
                  </div>
                  <div class="info-item">
                    <label>有机质含量：</label>
                    <span>高达10%以上</span>
                  </div>
                  <div class="info-item">
                    <label>pH值：</label>
                    <span>在6.0到7.5之间</span>
                  </div>
                  <div class="info-item">
                    <label>养分含量：</label>
                    <span>富含磷、氮、钾等</span>
                  </div>
                  <div class="info-item">
                    <label>保水性：</label>
                    <span>强</span>
                  </div>
                  <div class="info-item">
                    <label>环境影响：</label>
                    <span>易受到水蚀和风蚀</span>
                  </div>
          </div>
    </div>
        </div>
          <!-- 新增红框区域，4，4 布局 -->
  <div class="row mt-3">
    <div class="col-12 col-md-4 offset-md-4"> <!-- 左侧偏移4个宽度，使其与地图对齐 -->
      <div class="card equipdetail-card">
        <div class="card-header">设备使用详情</div>
        <div class="card-body">
          <!-- 在这里添加内容 -->
          <div class="table-responsive">
       <table class="table table-striped table-hover custom-table">
         <thead class="thead-dark">
           <tr>
               <th>#</th>
             <th>Name</th>
             <th>Price</th>
             <th>Hash</th>
             <th>Certification</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="(item, index) in paginatedData" :key="index">
             <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
             <td>{{ item.name }}</td>
             <td>{{ item.price }}</td>
             <td>{{ item.hash }}</td>
             <td>{{ item.cert }}</td>
           </tr>
         </tbody>
       </table>
     </div>
     <nav aria-label="Page navigation">
  <ul class="pagination justify-content-center">
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <a class="page-link" href="#" @click.prevent="goToPage(1)">首页</a>
    </li>
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <a class="page-link" href="#" @click.prevent="prevPage">上一页</a>
    </li>
    <li v-for="page in visiblePageNumbers" :key="page" class="page-item" :class="{ active: currentPage === page }">
      <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
    </li>
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <a class="page-link" href="#" @click.prevent="nextPage">下一页</a>
    </li>
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <a class="page-link" href="#" @click.prevent="goToPage(totalPages)">尾页</a>
    </li>
  </ul>
</nav>

        </div>
      </div>
    </div>
    <div class="col-12 col-md-4">
      <div class="card warning-card">
        <div class="card-header">预警与决策</div>
        <div class="card-body log-panel">
          <!-- 在这里添加内容 -->
          <div v-for="(entry, index) in logs" :key="index" class="log-entry">
        <span class="timestamp">{{ entry.timestamp }}</span>
        <span class="event">{{ entry.event }}</span>
      </div>
        </div>
      </div>
    </div>
  </div>
      </div>
    </div>
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
import HeaderBar from '@/components/HeaderBar.vue';
import { toLonLat } from 'ol/proj';
import apiService from '@/services/apiService';
  export default {
    name: 'DashboardPage',
    components: {
      HeaderBar, // 注册标题栏组件
    },
    data() {
      return {
        map: null,
        overlay: null,
        logs: [
        { timestamp: '2024-10-10 12:23:25', event: '空气湿度含量过高，及时处理' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        { timestamp: '2024-10-10 12:23:25', event: '氨气浓度过高，及时通风' },
        // 可以添加更多的日志条目
      ],
        points: [
          { id: 1, name: 'Point 1', coords: [116.4074, 39.9042], description: 'This is Point 1 in Beijing.' },
          { id: 2, name: 'Point 2', coords: [-0.1276, 51.5074], description: 'This is Point 2 in London.' },
          { id: 3, name: 'Point 3', coords: [139.6917, 35.6895], description: 'This is Point 3 in Tokyo.' },
        ],
        initialCenter: null,
        clickedCoords: {
      lon: '暂无数据',
      lat: '暂无数据'
    },
    locationDetails: {
      province: '暂无数据',
      town: '暂无数据'
    },
    dataList: [
          // Add more items as needed
        ],
        currentPage: 1,
        itemsPerPage: 3,
      };
    },
    mounted() {
      this.initMap();
      if (this.points.length > 0) {
        this.clickedCoords.lon = this.points[0].coords[0].toFixed(4);
        this.clickedCoords.lat = this.points[0].coords[1].toFixed(4);
        this.fetchLocationDetails(this.points[0].coords);
      } 
    },
    async created() {
    try {
      // 获取数据
      const response = await apiService.getOnsaleData();
      console.log(response)
      response.data.forEach(element => {
        console.log(element)
        const Product={
            name:element.name,
            price:element.price,
            hash:element.hash,
            cert:element.cert
        }
        this.dataList.push(Product)
      });
      //console.log(this.items[1].avatar);    
    } catch (error) {
      this.errorMessage = 'Failed to load data.';
      console.error(error);
    }
  },
  computed: {
    totalPages() {
    return Math.ceil(this.dataList.length / this.itemsPerPage);
  },
  paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.dataList.slice(start, end);
  },
  visiblePageNumbers() {
    const total = this.totalPages;
    const current = this.currentPage;
    const range = 5; // 每次最多显示5个页码
    let start = Math.max(1, current - Math.floor(range / 2));
    let end = Math.min(total, start + range - 1);

    if (end - start < range - 1) {
      start = Math.max(1, end - range + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
    },
    methods: {
      goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  },
  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  },
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  },
  async fetchLocationDetails(coords) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords[1]}&lon=${coords[0]}&format=json&addressdetails=1&accept-language=zh`);
      const data = await response.json();
      const address = data.address;
      this.locationDetails.province = address.state || '未知';
      this.locationDetails.town = address.village || address.town || address.city || '未知';
    } catch (error) {
      console.error('Error fetching location details:', error);
      this.locationDetails.province = '未知';
      this.locationDetails.town = '未知';
    }
  },
      async initMap() {
        // Create the map
        if (this.points.length > 0) {
      this.initialCenter = this.points[0].coords;
    }
    const darkMapLayer = new TileLayer({
      source: new OSM({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      })
    });
    // Create the map
    this.map = new Map({
      target: this.$refs.map,
      layers:  [darkMapLayer],
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
          const coords = toLonLat(event.coordinate);
          this.clickedCoords.lon = coords[0].toFixed(4);
          this.clickedCoords.lat = coords[1].toFixed(4);
       // Fetch location details using Nominatim or other reverse geocoding service
       this.fetchLocationDetails(coords);
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
    background-image: url('../assets/blue.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* 设置地图容器的宽度和高度 */
  .custom-card {
    background-color: rgba(119, 119, 119, 0.5);
    border: none;
    margin-top: 20px;
    height: 60vh; /* 设置高度 */
  }
  .equipdetail-card{
    background-color: rgba(41, 41, 41, 0.7);
    margin-top: 40px;
    margin-left: 7px;
    height: 25vh;
    border: none;
  }
.equipdetail-card .card-body {
padding-top: 0px;
}
  .warning-card{
    background-color: rgba(41, 41, 41, 0.7);
    margin-top: 40px;
    margin-left: 7px;
    height: 25vh;
    border: none;
  }
  .info-card, .soil-info-card {
    background-color: rgba(107, 107, 107, 0.2);
    color: #fff;
    border: none;
    margin-top: 20px;
    padding-left: 10px;
    margin-right: 10px;
    display: flex;
  }
  
  .card-header {
    background-color: transparent;
    font-weight: bold;
    font-size: 16px;
    color: #fff;
    text-align: center;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    font-size: 14px;
  }
  
  .info-item label {
    font-weight: bold;
    color: #f0f0f0;
  }
  
  .info-item span {
    color: #f3c429;
    padding-right: 10px;
    padding-bottom: 5px;
  }
  
  /* 保证信息列和地图对齐 */
  .col-12.col-md-2 {
    display: flex;
    flex-direction: column;
    height: 60vh; /* 与地图框高度一致 */
  }
  .info-card {
    flex: 1;
    margin-bottom: 10px; /* 增加底部间距 */
  }
  
  .soil-info-card {
    flex: 1;
  }
  .table-responsive {
 width: 100%;
}
.custom-table {
   margin: 0; /* 移除表格的外边距 */
 border-spacing: 0; /* 移除单元格之间的空隙 */
 border-collapse: collapse; /* 合并边框，使其更紧凑 */
 border-radius: 12px;
 overflow: hidden;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-table thead th {
 background-color: rgba(52, 58, 64, 0.8); /* 半透明黑色背景 */
 color: #ffffff;
 font-weight: bold;
 text-align: center;
 border: none;
 padding: 8px; /* 缩小内边距 */
 font-size: 14px; /* 缩小文字大小 */
}

.custom-table tbody {
 background-color: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
}

.custom-table td, .custom-table th {
  padding: 8px; /* 缩小内边距 */
  font-size: 14px; /* 缩小文字大小 */
 vertical-align: middle;
}

.custom-table tbody tr:hover {
 background-color: rgba(241, 241, 241, 0.8); /* 半透明 hover 效果 */
}

.pagination .page-link {
  padding: 5px 10px; /* 调整按钮内边距 */
  font-size: 14px; /* 缩小文字大小 */
  color: #000;
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.pagination .page-item {
  margin: 0 0px; /* 减小按钮之间的间距 */
}

.pagination .page-item.active .page-link {
  background-color: #007bff; /* 激活状态背景色 */
  color: #fff;
  border-color: #007bff;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
}

.pagination .page-link:hover {
  background-color: #000; /* 悬停时背景色 */
  color: #fff;
  border-color: #000;
}

.log-panel {
  background-color: #00008B;
  color: #FFFFFF;
  padding: 10px;
  border: 1px solid #FFFFFF;
  max-height: 150px; /* 控制高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
  font-family: monospace;
}

.log-entry {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.timestamp {
  flex-shrink: 0;
}

.event {
  margin-left: 10px;
}
  </style>
  
  