import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/Home.vue'
import AlgorithmsPage from '@/views/algorithms.vue';
import SensorsPage from '@/views/sensors.vue';
import DatasetPage from '@/views/dataset.vue'
import ImgsensorPage from '@/views/imgsensor.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage, meta: { hideNavbar: true }  },
  { path: '/algorithms', name: 'Algorithms', component: AlgorithmsPage,meta: { requiresAuth: true }  },
  { path: '/sensors', name: 'Sensors', component: SensorsPage,meta: { requiresAuth: true }  },
  { path: '/dataset', name: 'Dataset', component: DatasetPage,meta: { requiresAuth: true }  },
  { path: '/imgsensor', name: 'Imgsensor', component: ImgsensorPage,meta: { requiresAuth: true }  }
]

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
