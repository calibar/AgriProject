<template>
    <div class="header-bar">
      <div class="header-left">
        <span>{{ formattedDateTime }}</span>
      </div>
      <div class="header-center">
        <h1>{{title}}</h1>
      </div>
      <div class="header-right">
        <button @click="navigateTo('/dashboard')" :class="['header-jumper', isActive('/dashboard') ? 'active' : '']">土壤</button>
        <button @click="navigateTo('/gas')" :class="['header-jumper', isActive('/gas') ? 'active' : '']">气体</button>
        <button @click="navigateTo('/vision')" :class="['header-jumper', isActive('/vision') ? 'active' : '']">视觉</button>
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
    props: {
    title: {
      type: String,
      required: true
    }
  },
    data() {
      return {
        formattedDateTime: '',
        username: '',
        isDropdownVisible: false, // 控制导航菜单显示/隐藏
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
      },
      toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible; // 切换下拉菜单状态
      alert(this.isDropdownVisible)
    },
    navigateTo(path) {
      this.$router.push(path);
      this.isDropdownVisible = false; // 点击后隐藏下拉菜单
    },
    isActive(path) {
    return this.$route.path === path; // 判断当前路径是否与按钮绑定路径匹配
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
  .header-right .header-icon:hover {
    background: gold; /* hover 时背景色变为金色 */
  color: black; /* hover 时字体变为黑色 */
  border-color: white; /* hover 时边框变为白色 */
  transform: scale(1.1); /* hover 时放大按钮 */
  box-shadow: 0px 4px 10px rgba(255, 215, 0, 0.5); /* 添加金色阴影 */
  }
  .header-right .header-jumper {
  background: rgba(255, 255, 255, 0.2); /* 半透明白色背景 */
  border: 2px solid rgb(255, 239, 148,0.2); /* 金色边框 */
  color: gold; /* 金色字体 */
  font-size: 14px;
  margin-right: 10px;
  padding: 5px 15px; /* 增加左右内边距 */
  cursor: pointer;
  border-radius: 20px; /* 圆角效果 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
}

.header-right .header-jumper:hover {
  background: gold; /* hover 时背景色变为金色 */
  color: black; /* hover 时字体变为黑色 */
  border-color: white; /* hover 时边框变为白色 */
  transform: scale(1.1); /* hover 时放大按钮 */
  box-shadow: 0px 4px 10px rgba(255, 215, 0, 0.5); /* 添加金色阴影 */
}
.header-right .header-jumper.active {
  background: gold; /* 高亮背景色 */
  color: black; /* 高亮字体颜色 */
  border-color: black; /* 高亮边框颜色 */
  box-shadow: 0px 4px 15px rgba(255, 215, 0, 0.7); /* 高亮时更明显的阴影 */
}
/* Navbar container */
.navbar {
  overflow: hidden;
  background-color: #333;
  font-family: Arial;
}

/* Links inside the navbar */
.navbar a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}


  </style>
  