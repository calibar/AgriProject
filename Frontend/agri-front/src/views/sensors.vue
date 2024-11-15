<template>
    <div id="app" class="d-flex justify-content-center align-items-center vh-100 sensors-page">
       <div class="container-fluid mt-5">
     <h2 class="text-center mb-4" style="color: white;">传感器设备列表</h2>
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
           <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
         </li>
         <li class="page-item" :class="{ disabled: currentPage === totalPages }">
           <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
         </li>
       </ul>
     </nav>
   </div>
    </div>

 </template>
 
 <script>
import apiService from '@/services/apiService';
 export default {
   name:'SensorsPage',
   data() {
     return {
       dataList: [
         // Add more items as needed
       ],
       currentPage: 1,
       itemsPerPage: 13,
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
     nextPage() {
       if (this.currentPage < this.totalPages) this.currentPage++;
     },
     prevPage() {
       if (this.currentPage > 1) this.currentPage--;
     },
   },
 };
 </script>
 
 <style>
.sensors-page {
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
 </style>
 