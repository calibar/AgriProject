<template>
  <div id="app">
    <Navbar 
      v-if="!$route.meta.hideNavbar" 
      :collapsed="isCollapsed" 
      @update:collapsed="handleCollapse" 
    />
    <div :class="['content', { 'collapsed': isCollapsed, 'full-width': $route.meta.hideNavbar }]">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      isCollapsed: window.innerWidth <= 1500 // 初始化时检测屏幕宽度
    };
  },
  methods: {
    handleCollapse(collapsed) {
      this.isCollapsed = collapsed;
    },
    checkScreenWidth() {
      console.log(window.innerWidth)
      this.isCollapsed = window.innerWidth <= 1500;
      console.log(this.isCollapsed)
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkScreenWidth);
    this.checkScreenWidth(); // 初始化调用，确保正确的折叠状态
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenWidth);
  }
};
</script>

<style>
body, #app {
  margin: 0;
}

.content {
  transition: margin-left 0.3s ease;
}
.content.collapsed {
  margin-left: 60px; /* 侧边栏折叠后的左边距 */
}
.content:not(.collapsed):not(.full-width) {
  margin-left: 290px;
}

/* 导航栏隐藏时，内容区域占满整个宽度 */
.content.full-width {
  margin-left: 0;
}
</style>
