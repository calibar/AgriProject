<template>
    <div id="app">
      <HeaderBar title="有害气体浓度类传感器数据优化"></HeaderBar>
      <div class="container-fluid">
        <div class="row ">
        <div class="col-12 col-md-4">
          <div class="card selection-card">
    <div class="card-header">选择面板</div>
    <div class="card-body">
      <form>
        <div class="row mb-2">
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">生产厂家</span>
              <select v-model="selectedManufaturer" id="manufacturer" class="form-select form-select-sm">
                <option v-for="(manufacturer, index) in manufacturers" :key="index" :value="manufacturer">
                  {{ manufacturer }}
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">传感器类型</span>
              <select v-model="selectedDeviceType" id="deviceType" class="form-select form-select-sm">
                <option v-for="(type, index) in deviceTypes" :key="index" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">传感器编号</span>
              <select v-model="selectedModel" id="model" class="form-select form-select-sm">
                <option v-for="(model, index) in models" :key="index" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">开始时间</span>
              <input
                type="datetime-local"
                id="startTime"
                class="form-control form-control-sm"
                v-model="startTime"
                @focus="removePlaceholder('startTime')"
                @blur="addPlaceholder('startTime', '请选择开始时间')"
              >
            </div>
          </div>
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">结束时间</span>
              <input
                type="datetime-local"
                id="endTime"
                class="form-control form-control-sm"
                v-model="endTime"
                @focus="removePlaceholder('endTime')"
                @blur="addPlaceholder('endTime', '请选择结束时间')"
              >
            </div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">优化算法</span>
              <select v-model="selectedOptimizationAlgorithm" id="optimization" class="form-select form-select-sm">
                <option v-for="(algo, index) in optimizationAlgorithms" :key="index" :value="algo">
                  {{ algo }}
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">校准算法</span>
              <select v-model="selectedCalibrationAlgorithm" id="algorithm" class="form-select form-select-sm">
                <option v-for="(algo, index) in calibrationAlgorithms" :key="index" :value="algo">
                  {{ algo }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-outline-light btn-sm w-100">提交</button> <!-- 设置 w-100 使按钮充满宽度 -->
          </div>
        </div>
      </form>
    </div>
  </div>
        <div class="card result-card">
          <div class="card-header">
            实时监测面板
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover data-table">
                <thead class="thead-dark">
                <tr>
                  <th></th>
                  <th>湿度</th>
                  <th>温度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: left;font-size: 14px; color: #f3c429;font-weight: bold;">环境参数</td>
                  <td><div id="humidity-chart" style="width: 11vh; height: 11vh;"></div></td>
                  <td><div id="temperature-chart" style="width: 11vh; height: 11vh;"></div></td>
                </tr>
              </tbody>
              </table>
            </div>
            <div class="table-responsive">
              <table class="table table-striped table-hover data-table">
                <thead class="thead-dark">
                <tr>
                  <th style="text-align: left;font-size: 14px; color: #f3c429;font-weight: bold;">有害气体浓度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 0%;">
                    <!-- 饼图 -->
                    <div id="pie-chart" style="width: 100%; height: 20vh; margin: auto;"></div>
                    <!-- 折线图 -->
                    <div id="line-chart" style="width: 100%; height: 20vh; margin: auto; margin-top: 10px;"></div>
                  </td>
                </tr>
              </tbody>
              </table>
            </div>
            </div>
        </div>
        </div>

        <div class="col-12 col-md-6">
          <!-- 将地图放入 card 中，去掉 header，只显示地图 -->
          <div class="card custom-card">
            <div class="card-header">
              气体传感器分布地图
            </div>
            <div class="card-body p-0"> <!-- 去掉卡片内边距 -->
              <div id="map" ref="map" style="width: 100%; height: 60vh;"></div> <!-- 设置地图的高度 -->
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2">
          <div class="card gas-info-card">
      <div class="card-header">氨气浓度排名</div>
      <div class="card-body p-0">
                  <div v-for="(item, index) in AnGas" :key="index" class="info-item">
                    <label>TOP {{index+1}}:</label>
                    <span>{{ item.name }}</span>
                  </div>
          </div>
    </div>
          <div class="card info-card">
    <div class="card-header">当前位置</div>
    <div class="card-body p-0">
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
  <div class="card gas-info-card">
      <div class="card-header">当前场景气体浓度排名</div>
      <div class="card-body p-0">
                  <div v-for="(item, index) in TopGasCurrent" :key="index" class="info-item">
                    <label>TOP {{index+1}}:</label>
                    <span>{{ item.name }}</span>
                  </div>
          </div>
    </div>
        </div>
          <!-- 新增红框区域，4，4 布局 -->
  <div class="row mt-3">
    <div class="col-12 col-md-4 offset-md-4"> <!-- 左侧偏移4个宽度，使其与地图对齐 -->
      <div class="card equipdetail-card">
        <div class="card-header">设备使用详情</div>
        <div class="card-body p-0">
          <!-- 在这里添加内容 -->
          <div class="table-responsive">
       <table class="table table-striped  table-hover custom-table">
         <thead class="thead-dark">
           <tr>
               <th>序号</th>
             <th>传感器名称</th>
             <th>传感器编号</th>
             <th>传感器类型</th>
             <th>工作状态</th>
             <th>生产场景</th>
             <th>采样间隔</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="(item, index) in paginatedData" :key="index">
             <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
             <td>{{ item.name }}</td>
             <td>{{ item.price }}</td>
             <td>{{ item.hash }}</td>
             <td>{{ item.cert }}</td>
             <td>{{ item.name }}</td>
             <td>{{ item.price }}</td>
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
import * as echarts from "echarts";
  export default {
    name: 'GasPage',
    components: {
      HeaderBar, // 注册标题栏组件
    },
    data() {
      return {
        map: null,
        overlay: null,
        envparam:{
          moisture:'',
          tension:'' 
        },
      manufacturers: ['所有厂家', '厂家1', '厂家2'],
      deviceTypes: ['所有类型', '类型1', '类型2'],
      models: ['SF001', 'SF002'],
      optimizationAlgorithms: ['所有算法', '算法1', '算法2'],
      calibrationAlgorithms: ['SensorFormer', '算法B'],
      selectedManufaturer:'所有厂家',
      selectedDeviceType:'所有类型',
      selectedModel:'SF001',
      selectedOptimizationAlgorithm:'所有算法',
      selectedCalibrationAlgorithm:'算法B',
      startTime: this.getFormattedDate ? this.getFormattedDate(new Date()) : '', 
      endTime: this.getFormattedDate ? this.getFormattedDate(new Date()) : '' ,
            // 饼图数据
            pieData: [
        { value: 35, name: "气体" },
        { value: 25, name: "碳化物" },
        { value: 15, name: "甲烷" },
        { value: 10, name: "氮化物" },
        { value: 10, name: "PM10" },
        { value: 5, name: "其他" },
      ],
      // 折线图数据
      lineSeries: [
        {
          name: "气体",
          type: "line",
          data: [50, 60, 55, 70, 65, 80],
          smooth: true,
        },
        {
          name: "碳化物",
          type: "line",
          data: [40, 45, 50, 48, 55, 60],
          smooth: true,
        },
        {
          name: "甲烷",
          type: "line",
          data: [20, 25, 23, 30, 28, 35],
          smooth: true,
        },
        {
          name: "氮化物",
          type: "line",
          data: [10, 12, 15, 14, 18, 20],
          smooth: true,
        },
        {
          name: "PM10",
          type: "line",
          data: [30, 32, 35, 38, 40, 42],
          smooth: true,
        },
        {
          name: "其他",
          type: "line",
          data: [5, 6, 7, 6, 8, 10],
          smooth: true,
        },
      ],
      // 折线图的横轴数据
      lineXAxisData: ["2019", "2020", "2021", "2022", "2023", "2024"],
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
        AnGas:[
        {name:'武汉养鸡场'},
          {name:'合肥养鸡场'},
          {name:'菏泽养鸡场'},
          {name:'廊坊养鸡场'},
          {name:'大庆养鸡场'}
        ],
        TopGasCurrent:[
          {name:'甲烷'},
          {name:'PM10'},
          {name:'硫化氢'}
        ],
        points: [
          { id: 1, name: '廊坊养鸡场', coords: [116.6838, 39.5296], description: '廊坊养鸡场' },
          { id: 2, name: '武汉养鸡场', coords: [114.3054, 30.5931], description: '武汉养鸡场' },
          { id: 3, name: '菏泽养鸡场', coords: [115.4812, 35.2336], description: '菏泽养鸡场' },
          { id: 4, name: '大庆养鸡场', coords: [125.1031, 46.5876], description: '大庆养鸡场' },
          { id: 5, name: '合肥养鸡场', coords: [117.2290, 31.8206], description: '合肥养鸡场' }
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
      this.renderHumidityChart();
      this.renderTemperatureChart();
      this.renderPieChart();
      this.renderLineChart();
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
    // 饼图
    renderPieChart() {
      const chartDom = document.getElementById("pie-chart");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: "污染物比例分布",
          left: "center",
          textStyle: {
            fontSize: 14, // 调小标题文字
            color: "#FFFFFF",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
          textStyle: {
            fontSize: 8, // 调小图例字体
            color: "#FFFFFF",
          },
        },
        series: [
          {
            name: "污染物",
            type: "pie",
            radius: "50%",
            data: this.pieData,
            label: {
              fontSize: 8, // 调小标签文字
              color: "#FFFFFF",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    },
    // 折线图
    renderLineChart() {
      const chartDom = document.getElementById("line-chart");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: "污染物趋势分析",
          left: "center",
          textStyle: {
            fontSize: 15, // 调小标题文字
            color: "#FFFFFF",
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: 20, // 图例距离顶部的距离
          textStyle: {
            fontSize: 8, // 调小图例字体
            color: "#FFFFFF",
          },
          itemGap: 5,
        },
        grid: {
          top: 50, // 调整图表内容距顶部的距离
          bottom: 20, // 调整图表内容距底部的距离
          left: 50,
          right: 20,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.lineXAxisData,
          axisLabel: {
            fontSize: 8, // 调小横轴标签
            color: "#FFFFFF",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            fontSize: 8, // 调小纵轴标签
            color: "#FFFFFF",
          },
        },
        series: this.lineSeries,
        color: ["#5470C6", "#91CC75", "#EE6666", "#FAC858", "#73C0DE", "#3BA272"],
      };
      myChart.setOption(option);
    },
    renderHumidityChart() {
    const chartDom = document.getElementById("humidity-chart");
    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%",
      },
      series: [
        {
          name: "湿度",
          type: "gauge",
          radius: "90%",
          splitNumber: 5, // 调整主刻度数量，减少刻度密度
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[0.5, "#58D9F9"], [1, "#C12E34"]],
            },
          },
          axisLabel: {
            show:false
          },
          axisTick: {
            splitNumber: 2, // 每两个主刻度间显示一个小刻度
            length: 6, // 小刻度长度
            lineStyle: {
              color: "#FFFFFF",
            },
          },
          splitLine: {
            length: 10, // 主刻度分割线长度
            lineStyle: {
              color: "#FFFFFF",
              width: 2,
            },
          },
          pointer: {
            width: 5,
          },
          detail: {
            formatter: "{value}%",
            fontSize: 14,
            color: "#FFFFFF",
          },
          data: [{ value: 50}],
        },
      ],
    };
    myChart.setOption(option);
  },
  renderTemperatureChart() {
    const chartDom = document.getElementById("temperature-chart");
    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}°C",
      },
      series: [
        {
          name: "温度",
          type: "gauge",
          //startAngle: 180,
          //endAngle: 0,
          radius: "90%",
          splitNumber: 5, // 调整主刻度数量
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[0.3, "#FFAB91"], [1, "#FF5722"]],
            },
          },
          axisLabel: {
           show:false
          },
          axisTick: {
            splitNumber: 2, // 每两个主刻度间显示一个小刻度
            length: 6, // 小刻度长度
            lineStyle: {
              color: "#FFFFFF",
            },
          },
          splitLine: {
            length: 10, // 主刻度分割线长度
            lineStyle: {
              color: "#FFFFFF",
              width: 2,
            },
          },
          pointer: {
            width: 5,
          },
          detail: {
            formatter: "{value}°C",
            fontSize: 14,
            color: "#FFFFFF",
          },
          data: [{ value: 24.12 }],
        },
      ],
    };
    myChart.setOption(option);
  },
      getFormattedDate(date) {
      // 格式化日期为 YYYY-MM-DDTHH:MM 格式
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
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
            src: '/pics/yellowdot.png',
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
    background-image: url('../assets/blue5.png');
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
    z-index: 1; /* 设置较低的 z-index，确保子组件的 z-index 能覆盖 */
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
 /* Popup styling */
 .ol-popup {
    position: absolute;
    background-color:rgba(255, 255, 255, 0.7);
    padding: 10px;
    border-radius: 8px;
    border: none;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    min-width: 150px;
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
    /*cursor: pointer;*/
    color: white;
  }
  
 /* .ol-popup::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color:none;
  }*/
  
  .popup-content {
    font-size: 14px;
    color:#554100;
    padding-top: 0px; /* Add padding to avoid overlap with close button */
  }
  .warning-card{
    background-color: rgba(41, 41, 41, 0.7);
    margin-top: 40px;
    margin-left: 7px;
    height: 25vh;
    border: none;
  }
  .info-card, .gas-info-card {
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
  
  .gas-info-card {
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
 font-size: 10px; /* 缩小文字大小 */
}

.custom-table tbody {
 background-color: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
}

.custom-table td, .custom-table th {
  padding: 8px; /* 缩小内边距 */
  font-size: 14px; /* 缩小文字大小 */
 vertical-align: middle;
 background-color: rgba(40, 40, 40, 0.8); /* 半透明白色背景 */
border: none;
 color: #ffc400;
}

.custom-table tbody tr:hover {
 background-color: rgba(0, 106, 255, 0.8); /* 半透明 hover 效果 */
}

.pagination .page-link {
  padding: 5px 10px; /* 调整按钮内边距 */
  font-size: 14px; /* 缩小文字大小 */
  color: #ffffff;
  background-color: rgba(21, 21, 21, 0.8); 
  border-color: #4c4c4c;
}

.pagination .page-item {
  margin: 0 0px; /* 减小按钮之间的间距 */
}

.pagination .page-item.active .page-link {
  background-color:#ffc400; /* 激活状态背景色 */
  color: #020202;
  border-color: #f5d56b;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
}

.pagination .page-link:hover {
  background-color: #007bff; /* 悬停时背景色 */
  color: #fff;
  border-color: #58a9ff;
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
.log-panel::-webkit-scrollbar {
  width: 8px;
}

.log-panel::-webkit-scrollbar-thumb {
  background-color: #a0a0a0; /* 滚动条滑块颜色 */
  border-radius: 4px; /* 圆角 */
}

.log-panel::-webkit-scrollbar-thumb:hover {
  background-color: #ccae00; /* 鼠标悬停时变为金黄色 */
}

.log-panel::-webkit-scrollbar-track {
  background-color: #343434; /* 滚动条轨道背景色 */
}
.log-panel::-webkit-scrollbar-thumb {
  transition: background-color 0.3s;
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
.selection-card {
  background-color: rgba(107, 107, 107, 0.2);
  color: white;
  margin-top: 20px;
  border: none;
  /*max-width: 600px;*/
  margin-right: 0px;
  height: 20vh;
}
.selection-card .card-header {
  font-weight: bold;
  font-size: 18px;
  text-align: center;
}

.input-group-text {
  background-color: #333;
  color: white;
  padding: 4px 8px; /* 缩小标签的内边距 */
  font-size: 12px; /* 缩小标签的字体大小 */
}

.form-select-sm, .form-control-sm {
  font-size: 12px; /* 缩小选择框和输入框的字体大小 */
  padding: 4px 8px; /* 缩小选择框和输入框的内边距 */
  background-color: rgba(61, 61, 61, 0.7); 
  color: #f3c429;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
}
.col-12.col-md-4{
  height: 60vh
}
.result-card{
  background-color: rgba(41, 41, 41, 0.7);
    color: #fff;
    border: none;
    margin-top: 20px;
    padding-left: 0px;
    margin-right: 0px;
    display: flex;
  height: 69vh;
}
.data-table {
   margin: 0; /* 移除表格的外边距 */
   margin-bottom: 0;
 border-spacing: 0; /* 移除单元格之间的空隙 */
 border-collapse: collapse; /* 合并边框，使其更紧凑 */
 border-radius: 12px;
 overflow: hidden;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 
}

.data-table thead th {
 background-color: rgba(52, 58, 64, 0.0); /* 半透明黑色背景 */
 color: #ffffff;
 font-weight: bold;
 text-align: center;
 border:#f0f0f0;
 padding: 8px; /* 缩小内边距 */
 font-size: 14px; /* 缩小文字大小 */
}

.data-table tbody {
 background-color: rgba(255, 255, 255, 0); /* 半透明白色背景 */
}

.data-table td, .data-table th {
  padding: 8px; /* 缩小内边距 */
  font-size: 14px; /* 缩小文字大小 */
 vertical-align: middle;
 background-color: rgba(40, 40, 40, 0.0); /* 半透明白色背景 */
 border: none;
 text-align: center; /* 表头和表格内容居中 */
 vertical-align: middle; /* 表格内容垂直居中 */
}

.data-table tbody tr:hover {
 background-color: rgba(0, 106, 255, 0.0); /* 半透明 hover 效果 */
}
#humidity-chart,
#temperature-chart {
  display: inline-block; /* 确保 div 不影响表格对齐 */
  vertical-align: bottom; /* 保证图表底部对齐 */
}
  </style>
  
  