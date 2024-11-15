<template>
  <sidebar-menu 
    :menu="menu" 
    :collapsed="isCollapsed" 
    @update:collapsed="onToggleCollapse" 
  />
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';

export default {
  components: {
    SidebarMenu
  },
  name: 'NavbarComponent',
  data() {
    return {
      menu: [
        // 菜单内容
        {
            //header: "欢迎 "+sessionStorage.getItem('username'),
            header:"传感器数据优化后台管理平台",
            hiddenOnCollapse: true,
            style: { fontSize: '1.5em', fontWeight: 'bold'} 
          },
          /*{
            href: '/buy',
            title: 'Purchase',
            icon: 'fa fa-shopping-cart',
            child: [
              {
                href: '/charts/sublink',
                title: 'Sub Link'
              }
            ]
          },*/
          {
            href: '/sensors',
            title: '传感器设备管理',
            icon: 'fa fa-microchip'
          },
          {
            href: '/imgsensor',
            title: '图像传感器管理',
            icon: 'fa fa-camera'
          },
          {
            href: '/algorithms',
            title: '算法管理',
            icon: 'fa fa-code',
          },
          {
            href: '/dataset',
            title: '数据集采集',
            icon: 'fa fa-database'
          },
          /*{
            href: '/map',
            title: '传感器地图',
            icon: 'fa fa-map'
          },*/
          {
            href: '/',
            title: '登出',
            icon: 'fa fa-user'
          },


      ],
      isCollapsed: window.innerWidth <= 768
    };
  },
  methods: {
    onToggleCollapse(collapsed) {
      this.isCollapsed = collapsed;
      this.$emit('update:collapsed', collapsed); // 传递折叠状态到 App.vue
    }
  },
};
</script>
<style>
.v-sidebar-menu {
  --vsm-primary-color: rgba(161, 62, 130, 0.5);
  --vsm-item-hover-bg: rgba(161, 62, 130, 0.5);
  --vsm-item-active-bg: rgba(161, 62, 130, 0.5);
}
.v-sidebar-menu .vsm--header {
  font-size: 1.2em !important; /* 使用 !important 强制生效 */
  font-weight: bold !important;
  text-align: center;
}
.v-sidebar-menu .vsm--item {
  font-family: 'PingFang SC', sans-serif;
}

</style>