<template>
    <div id="app">
      <HeaderBar title="视觉类传感器数据增强"></HeaderBar>
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
              <span class="input-group-text">增强算法</span>
              <select v-model="selectedOptimizationAlgorithm" id="optimization" class="form-select form-select-sm">
                <option v-for="(algo, index) in optimizationAlgorithms" :key="index" :value="algo">
                  {{ algo }}
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">识别算法</span>
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
            目标检测
          </div>
          <div class="card-body"> 
            <div class="row">
      <!-- 左侧竖排文字 -->
      <div class="col-1">
        <div class="vertical-text">
          病 虫 害 检 测
        </div>
      </div>
              <div class="col-11">
                <div class="image-target">
                  <img src="../assets/target.png" alt="描述图片内容" class="img-fluid">
                </div>
                <div class="result-section">
                <div class="result-row">
                    <span class="result-label">检测结果：</span>
                    <span class="result-value">黄叶病</span>
                </div>
                <div class="result-row">
                    <span class="result-label">可信度：</span>
                    <span class="result-value">78%</span>
                </div>
            </div>
              </div>
            </div> 
            <div class="row">
      <!-- 左侧竖排文字 -->
      <div class="col-1">
        <div class="vertical-text">
          成 熟 度 检 测
        </div>
      </div>
              <div class="col-11">
                <div class="image-maturity">
                  <img src="../assets/maturity.png" alt="描述图片内容" class="img-fluid">
                </div>

              </div>
            </div>           
            </div>
        </div>
        </div>

        <div class="col-12 col-md-5">
          <!-- 将地图放入 card 中，去掉 header，只显示地图 -->
          <div class="card custom-card">
            <div class="card-header">
              实时监测面板
            </div>
            <div class="card-body p-0"> <!-- 去掉卡片内边距 -->
              <div class="image-grid">
            <div class="image-item"><img src="../assets/s1.png" alt="Image 1"></div>
            <div class="image-item"><img src="../assets/s2.png" alt="Image 2"></div>
            <div class="image-item"><img src="../assets/s3.png" alt="Image 3"></div>
            <div class="image-item"><img src="../assets/s4.png" alt="Image 4"></div>
            <div class="image-item"><img src="../assets/s5.png" alt="Image 5"></div>
            <div class="image-item"><img src="../assets/s6.png" alt="Image 6"></div>
        </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="card gas-info-card">
      <div class="card-header">增强效果</div>
      <div class="card-body p-0">
          <!-- 添加的 Image Box -->
  <div class="image-box">
    <img src="../assets/augment.png" alt="描述图片内容" class="img-fluid">
  </div>
          </div>
    </div>
          <div class="card operation-card">
    <div class="card-header">用户操作记录</div>
    <div class="card-body operation-panel">
      <!-- 在这里添加内容 -->
      <div v-for="(entry, index) in operations" :key="index" class="operation-entry">
        <span class="timestamp">{{ entry.timestamp }}</span>
        <span class="event">{{ entry.event }}</span>
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
    </div>
  </template>
  
  <script>
  import 'ol/ol.css';
import HeaderBar from '@/components/HeaderBar.vue';
import apiService from '@/services/apiService';
  export default {
    name: 'VisionPage',
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
      operations:[
      { timestamp: '2024-09-15 12:23:25', event: 'lmx登录了系统' },
      { timestamp: '2024-10-10 12:23:25', event: 'admin登录了系统' },
      { timestamp: '2024-10-12 12:23:25', event: 'lmx登出了系统' },
        { timestamp: '2024-10-13 12:23:25', event: 'lmx登录了系统' },
        { timestamp: '2024-10-18 12:23:25', event: 'admin登出了系统' },
        { timestamp: '2024-10-21 12:23:25', event: 'admin登录了系统' },
        { timestamp: '2024-11-10 12:23:25', event: 'lmx登录了系统' },
        { timestamp: '2024-11-15 12:23:25', event: 'admin登出了系统' },
        { timestamp: '2024-11-17 12:23:25', event: 'lmx登录了系统' },
        // 可以添加更多的日志条目
      ],
    dataList: [
          // Add more items as needed
        ],
        currentPage: 1,
        itemsPerPage: 3,
      };
    },
    mounted() {

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
    background-color: rgba(55, 55, 55, 0.5);
    border: none;
    margin-top: 20px;
    height: 60vh; /* 设置高度 */
  }
  .equipdetail-card{
    background-color: rgba(41, 41, 41, 0.7);
    margin-top: 15px;
    margin-left: 7px;
    height: 25vh;
    width: 31.5vw;
    border: none;
  }
.equipdetail-card .card-body {
padding-top: 0px;
}
  .warning-card{
    background-color: rgba(41, 41, 41, 0.7);
    margin-top: 15px;
    margin-left: 7px;
    height: 25vh;
    width: 32.5vw;
    border: none;
  }
  .operation-card{
    background-color: rgba(41, 41, 41, 0.7);
    margin-top: 10px;
    margin-left: 0px;
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
  .col-12.col-md-3 {
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

.operation-panel {
  background-color: rgba(0, 0, 0, 0.1);
  color: #FFFFFF;
  padding: 10px;
  border: 1px solid #FFFFFF;
  max-height: 150px; /* 控制高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
  font-family: monospace;
}
.operation-panel::-webkit-scrollbar {
  width: 8px;
}

.operation-panel::-webkit-scrollbar-thumb {
  background-color: #a0a0a0; /* 滚动条滑块颜色 */
  border-radius: 4px; /* 圆角 */
}

.operation-panel::-webkit-scrollbar-thumb:hover {
  background-color: #ccae00; /* 鼠标悬停时变为金黄色 */
}

.operation-panel::-webkit-scrollbar-track {
  background-color: #343434; /* 滚动条轨道背景色 */
}
.operation-panel::-webkit-scrollbar-thumb {
  transition: background-color 0.3s;
}
.operation-entry {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
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
  height: 66vh;
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
.image-box {
  text-align: center;
  margin: 0px auto;
}

.image-box img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.image-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
}

.image-item {
    width: 100%;
    height: 17vh;
    overflow: hidden;
    border: 2px solid #ccc;
    border-radius: 4px;
}

.image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.row {
  display: flex;
  align-items: flex-start; /* 确保左侧文字顶部对齐 */
}

/* 左侧竖排文字样式 */
.vertical-text {
  writing-mode: vertical-rl; /* 垂直从右到左 */
  text-orientation: upright; /* 字体方向直立 */
  font-size: 16px;
  color:gold; /* 自定义文字颜色 */
  line-height: 1.5; /* 控制文字间距 */
  text-align: left;
  padding-left: 0; /* 去掉多余的内边距 */
  margin: 0; /* 去掉外边距 */
  margin-top: 50px;
  font-weight: bold;
}
.image-target {
  text-align: center;
  margin: 0px auto;
}

.image-target img {
  max-width: 27vw;
  height: 25vh;
  border-radius: 8px;
}
.result-section {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    margin-bottom: 20px;
}

.result-row {
    display: flex;
    align-items: center;
    font-size: 16px;
}

.result-label {
    font-weight: bold;
    margin-right: 5px;
}

.result-value {
  font-weight: bold;
    color: #ffcc00; /* 突出显示的结果颜色 */
}
.image-maturity {
  text-align: center;
  margin: 0px auto;
}

.image-maturity img {
  max-width: 27vw;
  height: 26.5vh;
  border-radius: 8px;
}
  </style>
  
  