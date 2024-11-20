import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/Home.vue'
import DashboardPage from '@/views/dashboard.vue';
import GasPage from '@/views/gas.vue';
import VisionPage from '@/views/vision.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage  },
  { path: '/dashboard', name: 'Dashboard', component:DashboardPage,meta: { requiresAuth: true }  },
  { path: '/gas', name: 'Gas', component: GasPage,meta: { requiresAuth: true }  },
  { path: '/vision', name: 'Vision', component: VisionPage,meta: { requiresAuth: true }  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('token'); // 检查token是否存在
  const isGuest=(sessionStorage.getItem('token')=="Guest")
  if (to.matched.some(record => record.meta.requiresAuth) && (!isAuthenticated||isGuest)) {
    // 如果没有token且尝试访问需要权限的页面，则重定向到登录页面
    //alert("You need to login to see this page, redirect you to login")
    next({ path: '/' });
  } else {
    next(); // 允许访问
  }
});
export default router;
