<template>
    <div id="app" class="d-flex justify-content-center align-items-center vh-100 transaction-page">
       <div class="container-fluid mt-5">
     <h2 class="text-center mb-4" style="color: white;">算法列表</h2>
     <div class="d-flex justify-content-end mb-4">
  <button class="btn btn-success" @click="openPopup('add')">添加数据</button>
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
           <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
         </li>
         <li class="page-item" :class="{ disabled: currentPage === totalPages }">
           <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
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



    </div>

 </template>
 
 <script>
import apiService from '@/services/apiService';
 export default {
   name:'AlgorithmsPage',
   data() {
    return {
    dataList: [],
    currentPage: 1,
    itemsPerPage: 13,
    showPopup: false, // 控制弹窗显示
    popupMode: '', // 弹窗模式: 'add' 或 'edit'
    formItem: { name: '', price: '', hash: '', cert: '' }, // 表单绑定数据
    editIndex: null, // 修改时的索引
    showDeleteConfirm: false, // 控制删除确认弹窗显示
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
   },
   methods: {
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
 cursor: pointer;
 color: #000; /* 将文本颜色设为黑色 */
 background-color: #f8f9fa; /* 默认背景颜色 */
 border-color: #dee2e6; /* 默认边框颜色 */
}

.pagination .page-item:not(.disabled) .page-link:hover {
 background-color: #000; /* 鼠标悬停时变为黑色背景 */
 color: #fff; /* 悬停时文字变为白色 */
 border-color: #000; /* 悬停时边框变为黑色 */
}
.pagination .page-link:focus {
 outline: none; /* 移除聚焦时的蓝色边框 */
 box-shadow: none; /* 取消聚焦时的阴影效果 */
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
 </style>
 