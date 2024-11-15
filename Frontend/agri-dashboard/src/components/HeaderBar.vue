<template>
    <div class="header-bar">
      <div class="header-left">
        <span>{{ formattedDateTime }}</span>
      </div>
      <div class="header-center">
        <h1>土壤传感器的时序类数据优化</h1>
      </div>
      <div class="header-right">
        <span>欢迎您 {{ username }}</span>
        <button @click="logout" class="header-icon logout-button">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderBar',
    data() {
      return {
        formattedDateTime: '',
        username: ''
      };
    },
    created() {
      this.updateDateTime();
      setInterval(this.updateDateTime, 1000); // 每秒更新一次时间
      this.username = sessionStorage.getItem("username");
    },
    methods: {
      updateDateTime() {
        const now = new Date();
        const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayOfWeek = daysOfWeek[now.getDay()];
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.formattedDateTime = `${year}年${month}月${date}日 ${hours}:${minutes}:${seconds} ${dayOfWeek}`;
      },
      logout() {
        sessionStorage.clear();
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative; /* 使 .header-center 能够居中 */
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    padding: 10px 0;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    border-bottom: 2px solid #00d5ffb5;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  
  .header-left span {
    margin-right: 10px;
  }
  
  .header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%); /* 确保真正水平居中 */
    display: flex;
    justify-content: center;
  }
  
  .header-center h1 {
    font-size: 1.5em;
    margin: 0;
    color: #ffffff;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    padding-right: 20px;
  }
  
  .header-right .header-icon {
    background: none;
    border: none;
    color: #ffffff;
    font-size: 1.2em;
    margin-left: 10px;
    cursor: pointer;
  }
  </style>
  