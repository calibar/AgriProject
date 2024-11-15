<template>
  <div class="row imgsensor-page">
    <div class="col-sm-4 mb-4" v-for="(item, index) in items" :key="index">
      <div class="card shadow-lg rounded border-0" style="background-color:linear-gradient(135deg, #e3f2fd, #ffffff); padding: 20px;">
        <img class="card-img-top fixed-image" v-bind:src="item.avatar" alt="Card image cap">
        <div class="card-body text-start">
          <h5 class="card-title">{{ item.name }}</h5>

          <!-- Card with black background and white text and border -->
          <div class="card-info-row">
            <span>Hash:</span>
            <span class="info-value">{{ item.hash }}</span>
          </div>
          <div class="card-info-row">
            <span>Certification:</span>
            <span class="info-value">{{ item.cert }}</span>
          </div>
          <div class="card-info-row">
            <span>Price:</span>
            <span class="info-value">{{ item.price }}</span>
          </div>

          <button @click="showPopup(item)" class="btn btn-primary buy-button">Buy Now</button>
        </div>
      </div>
    </div>

    <!-- Popup Modal -->
    <div v-if="modalVisible" class="modal-overlay">
      <div class="modal-content">
        <img :src="selectedItem.avatar" alt="Item Image" class="modal-img">
        <h5>{{ selectedItem.name }}</h5>

        <!-- Align each label and value pair in popup -->
        <div class="info-row">
          <span>Hash:</span>
          <span class="info-value">{{ selectedItem.hash }}</span>
        </div>
        <div class="info-row">
          <span>Certification:</span>
          <span class="info-value">{{ selectedItem.cert }}</span>
        </div>
        <div class="info-row">
          <span>Price:</span>
          <span class="info-value">{{ selectedItem.price }}</span>
        </div>
        <div class="info-row">
          <span>Timestamp:</span>
          <span class="info-value">{{ selectedItem.timestamp }}</span>
        </div>

        <button @click="submitPurchase" class="btn btn-success">Submit</button>
        <button @click="closePopup" class="btn btn-secondary">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService';

export default {
  name: 'ImgsensorPage',
  data() {
    return {
      items: [],
      errorMessage: '',
      modalVisible: false,
      selectedItem: {},
    };
  },
  async created() {
    try {
      const response = await apiService.getOnsaleData();
      this.items = response.data;
    } catch (error) {
      this.errorMessage = 'Failed to load data.';
      console.error(error);
    }
  },
  methods: {
    showPopup(item) {
      this.selectedItem = { ...item, timestamp: new Date().toLocaleString() };
      this.modalVisible = true;
    },
    closePopup() {
      this.modalVisible = false;
      this.selectedItem = {};
    },
    submitPurchase() {
      console.log('Submitting purchase for:', this.selectedItem);
      this.closePopup();
    },
  },
};
</script>

<style scoped>
/* Card hover effect */
.card:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

/* Buy page styles */
.imgsensor-page {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  background-image: url('../assets/purple.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Flex row for each label and value */
/* Flex row for each label and value */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 14px;
}

.info-row span:first-child {
  text-align: left;
  flex: 0 0 40%; /* 固定宽度让标签左对齐 */
}
/* Styles for info-row in card */
.card-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 14px;
  background-color: #0b684c; /* 深灰色背景 */
  color: #fff; /* 白色文字 */
  padding: 5px 10px; /* 内边距增加视觉效果 */
  border: 1px solid #fff; /* 白色边框 */
  border-radius: 4px; /* 圆角效果 */
}

.card-info-row span:first-child {
  text-align: left;
  flex: 0 0 40%; /* 固定宽度让标签左对齐 */
}

.card-info-row .info-value {
  text-align: right;
  color: #fff; /* 确保值也是白色 */
  flex: 1;
}

.info-value {
  text-align: right;
  flex: 1;
  color: #333;
}
/* Centered and Long Button Styles */
.buy-button {
  width: 100%; /* 让按钮宽度占满父元素 */
  padding: 10px 0; /* 增加按钮上下内边距 */
  font-size: 16px; /* 增大字体 */
  border-radius: 5px; /* 圆角按钮 */
}
/* Fixed image size for card */
.fixed-image {
  width: 100%; /* 使图片适应卡片宽度 */
  height: 300px; /* 固定高度 */
  object-fit: cover; /* 裁剪图片以适应宽高比，不会拉伸变形 */
  border-radius: 5px; /* 图片圆角 */
}
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal-content h5 {
  margin-top: 10px;
}

.modal-content button {
  margin-top: 10px;
}

.modal-img {
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 15px;
}
</style>
