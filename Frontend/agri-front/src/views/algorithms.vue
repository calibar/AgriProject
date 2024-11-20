<template>
    <div id="app" class="d-flex justify-content-center align-items-center vh-100 transaction-page">
       <div class="container-fluid mt-5">
     <h2 class="text-center mb-4" style="color: white;">算法列表</h2>
     <div class="filter-bar p-2 mb-1">
  <div class="form-group me-3">
    <label for="nameFilter" class="form-label-inline">名称:</label>
    <select class="form-control-inline" id="nameFilter" v-model="filters.name">
      <option value="">全部</option>
      <option v-for="option in options.name" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
  <div class="form-group me-3">
    <label for="statusFilter" class="form-label-inline">工作状态:</label>
    <select class="form-control-inline" id="statusFilter" v-model="filters.status">
      <option value="">全部</option>
      <option v-for="option in options.status" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
  <div class="form-group me-3">
    <label for="sceneFilter" class="form-label-inline">所处场景:</label>
    <select class="form-control-inline" id="sceneFilter" v-model="filters.scene">
      <option value="">全部</option>
      <option v-for="option in options.scene" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
  <button class="btn btn-outline-light btn-sm search-button" @click="applyFilters">搜索</button>
  <button class="btn btn-outline-light btn-sm search-button" @click="openPopup('add')">添加数据</button>
</div>
     <div class="table-responsive">
       <table class="table table-striped table-hover custom-table">
         <thead class="thead-dark">
           <tr>
               <th>#</th>
             <th>Name</th>
             <th>Price</th>
             <th>Hash</th>
             <th>Certification</th>
             <th>操作</th>
           </tr>
         </thead>
         <tbody>
  <tr v-for="(item, index) in paginatedData" :key="index">
    <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.price }}</td>
    <td>{{ item.hash }}</td>
    <td>{{ item.cert }}</td>
    <td>
      <a href="#" @click.prevent="detailPopup(item)" class="text-success">
        <i class="fas fa-info"></i> 详情
</a>|
      <a href="#" @click.prevent="openPopup('edit', item, index)" class="text-primary">
  <i class="fas fa-edit"></i> 修改
</a>|
      <a href="#" @click.prevent="openDeleteConfirm(index)" class="text-danger">
  <i class="fas fa-trash-alt"></i> 删除
</a>

    </td>
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
   <div v-if="showPopup" class="popup">
  <div class="popup-content">
    <h3 class="text-center">{{ popupMode === 'add' ? '添加数据' : '修改数据' }}</h3>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="itemName" class="form-label">Name:</label>
        <input type="text" class="form-control dark-input" id="itemName" v-model="formItem.name" />
      </div>
      <div class="mb-3">
        <label for="itemPrice" class="form-label">Price:</label>
        <input type="number" class="form-control dark-input" id="itemPrice" v-model="formItem.price" />
      </div>
      <div class="mb-3">
        <label for="itemHash" class="form-label">Hash:</label>
        <input type="text" class="form-control dark-input" id="itemHash" v-model="formItem.hash" />
      </div>
      <div class="mb-3">
        <label for="itemCert" class="form-label">Certification:</label>
        <input type="text" class="form-control dark-input" id="itemCert" v-model="formItem.cert" />
      </div>
      <button type="submit" class="btn btn-primary w-100">{{ popupMode === 'add' ? '提交新数据' : '提交修改' }}</button>
      <button type="button" class="btn btn-secondary w-100 mt-2" @click="closePopup">取消</button>
    </form>
  </div>
</div>

<div v-if="showDeleteConfirm" class="delete-popup">
  <div class="popup-content">
    <h3>确认删除</h3>
    <p>您确定要删除这个条目吗？</p>
    <div class="d-flex justify-content-around">
      <button class="btn btn-danger" @click="confirmDelete">删除</button>
      <button class="btn btn-secondary" @click="cancelDelete">取消</button>
    </div>
  </div>
</div>

    <!-- Popup Modal -->
    <div v-if="modalVisible" class="modal-overlay">
      <div class="modal-content">
        <h5>数据详情</h5>

        <!-- Align each label and value pair in popup -->
        <div class="info-row">
          <span>name:</span>
          <span class="info-value">{{ formItem.name }}</span>
        </div>
        <div class="info-row">
          <span>Hash:</span>
          <span class="info-value">{{ formItem.hash }}</span>
        </div>
        <div class="info-row">
          <span>Certification:</span>
          <span class="info-value">{{ formItem.cert }}</span>
        </div>
        <div class="info-row">
          <span>Price:</span>
          <span class="info-value">{{ formItem.price }}</span>
        </div>
        <button @click="closePopup" class="btn btn-secondary">Close</button>
      </div>
    </div>

    </div>

 </template>
 
 <script>
import apiService from '@/services/apiService';
 export default {
   name:'AlgorithmsPage',
   data() {
    return {
    dataList: [],
    filters: {
      name: '',
      status: '',
      scene: ''
    },
    options: {
      name: [], // 名称选项
      status: [], // 工作状态选项
      scene: [] // 所处场景选项
    },
    filteredData: [],
    currentPage: 1,
    itemsPerPage: 13,
    showPopup: false, // 控制弹窗显示
    popupMode: '', // 弹窗模式: 'add' 或 'edit'
    formItem: { name: '', price: '', hash: '', cert: '' }, // 表单绑定数据
    editIndex: null, // 修改时的索引
    showDeleteConfirm: false, // 控制删除确认弹窗显示
    modalVisible: false
  };
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
     this.options.name = [...new Set(this.dataList.map(item => item.name))];
     this.options.status =[...new Set(this.dataList.map(item => item.hash))];
     this.options.scene =[...new Set(this.dataList.map(item => item.price))];
     this.filteredData = this.dataList;
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
  return this.filteredData.slice(start, end);
},

   },
   methods: {
    applyFilters() {
      this.filteredData = this.dataList.filter(item => {
          const matchesName = this.filters.name === '' || item.name === this.filters.name;
          const matchesStatus = this.filters.status === '' || item.hash === this.filters.status;
          const matchesScene = this.filters.scene === '' || item.price === this.filters.scene;
      return matchesName && matchesStatus && matchesScene;
  });
  this.currentPage = 1; // 重新分页
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
  detailPopup(item) {
      this.formItem = { ...item};
      this.modalVisible = true;
    },
    openPopup(mode, item = null, index = null) {
    this.popupMode = mode;
    if (mode === 'edit') {
      this.formItem = { ...item }; // 克隆正在编辑的数据
      this.editIndex = index;
    } else {
      this.formItem = { name: '', price: '', hash: '', cert: '' }; // 初始化为新数据
      this.editIndex = null;
    }
    this.showPopup = true;
  },
  closePopup() {
    this.modalVisible=false
    this.showPopup = false;
    this.formItem = { name: '', price: '', hash: '', cert: '' };
    this.popupMode = '';
    this.editIndex = null;
  },
  submitForm() {
    if (this.popupMode === 'edit' && this.editIndex !== null) {
      this.dataList.splice(this.editIndex, 1, { ...this.formItem }); // 替换编辑的数据
    } else if (this.popupMode === 'add') {
      this.dataList.push({ ...this.formItem }); // 添加新数据
    }
    this.closePopup();
  },
    openDeleteConfirm(index) {
    this.deleteIndex = index;
    this.showDeleteConfirm = true;
  },
  confirmDelete() {
    if (this.deleteIndex !== null) {
      this.dataList.splice(this.deleteIndex, 1);
    }
    this.cancelDelete();
  },
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteIndex = null;
  },
  // 其他方法...
  },

 };
 </script>
 
 <style>
.transaction-page {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;
 color: #2c3e50;
 margin-top:0px;
 background-image: url('../assets/purple.jpg');
 background-size: cover;
 background-position: center;
 background-repeat: no-repeat;
}
.container-fluid {
 max-width: 100%;
}

.table-responsive {
 width: 100%;
 margin-top: 0;
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
}

.custom-table tbody {
 background-color: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
}

.custom-table td, .custom-table th {
 padding: 16px;
 vertical-align: middle;
}

.custom-table tbody tr:hover {
 background-color: rgba(241, 241, 241, 0.8); /* 半透明 hover 效果 */
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
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(64, 64, 64, 0.9); /* 深色背景，略透明 */
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  width: 50%; /* 设置宽度为50% */
  max-width: 800px; /* 最大宽度 */
  min-width: 400px; /* 最小宽度 */
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
}

.popup-content h3 {
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}

.form-label {
  text-align: left; /* 左对齐 */
  display: block;
}

.dark-input {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dark-input:focus {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.7);
}

.btn-secondary {
  background-color: #6c757d; /* 取消按钮灰色 */
  color: white;
}

.delete-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(85, 85, 85, 0.9); /* 较浅的白色背景 */
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  width: 30%; /* 设置宽度为 30% */
  max-width: 400px; /* 最大宽度 */
  min-width: 300px; /* 最小宽度 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.delete-popup .popup-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #ffffff;
}

.delete-popup h3 {
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
}

.delete-popup .btn {
  padding: 10px;
  font-size: 0.9rem;
}
.btn-success {
  background-color: #28a745; /* 绿色背景 */
  color: white;
  border: none;
  padding: 10px 20px;
}

.btn-success:hover {
  background-color: #218838;
  color: white;
}
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(64, 64, 64, 0.9); /* 深色背景，略透明 */
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  width: 50%; /* 设置宽度为50% */
  max-width: 500px; /* 最大宽度 */
  min-width: 300px; /* 最小宽度 */
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: white;
}

.modal-content h5 {
  margin-top: 10px;
  color: #ffffff;
}

.modal-content button {
  margin-top: 10px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 16px;
}

.info-row span:first-child {
  text-align: left;
  flex: 0 0 40%; /* 固定宽度让标签左对齐 */
  color: #ffffff;
}
.info-value {
  text-align: right;
  flex: 1;
  color:gold;
  font-size: 16px;
}
.filter-bar {
  background-color: none; /* 半透明黑色背景 */
  border-radius: 8px; /* 圆角 */
  display: flex;
  flex-wrap: wrap; /* 支持换行 */
  gap: 15px; /* 间距 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 左对齐 */
  margin-bottom: 0;
  padding: 0px 0px;
}

.form-group {
  display: flex;
  align-items: center; /* 让标签和选择框在同一行 */
  gap: 10px; /* 标签与选择框的间距 */
}

.form-label-inline {
  color: white;
  font-weight: bold;
  margin-bottom: 0; /* 避免额外的行间距 */
}

.form-control-inline {
  background-color: rgba(255, 255, 255, 0.2);
  color:gold;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 5px 10px;
  height: 38px; /* 与按钮高度一致 */
}
/* 下拉框展开时选项的背景和字体样式 */
.form-control-inline option {
  background-color: rgba(0, 0, 0, 0.8); /* 黑色半透明背景 */
  color: gold; /* 金色字体 */
  padding: 5px; /* 选项内间距 */
}
.form-control-inline:focus {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.7);
  outline: none;
}

/* 按钮通用样式 */
.search-button, .btn-secondary{
  display: flex; /* 使用 flexbox 布局 */
  justify-content: center; /* 水平方向居中 */
  align-items: center; /* 垂直方向居中 */
  height: 38px; /* 按钮高度设置为 30px */
  padding: 0 15px; /* 左右内边距 */
  font-weight: bold; /* 字体加粗 */
  font-size: 14px; /* 字体大小 */
  text-align: center; /* 文字居中 */
  white-space: nowrap; /* 避免文字换行 */
  border-radius: 5px; /* 圆角 */
}

/* 搜索按钮 */
.search-button {
  background-color: #007bff; /* 蓝色背景 */
  color: white; /* 白色文字 */
  border: none; /* 无边框 */
}

.search-button:hover {
  background-color: #0056b3; /* 悬停时背景变深 */
  color: white;
}
 </style>
 