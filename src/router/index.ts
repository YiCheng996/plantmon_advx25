import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/capture',
      name: 'capture',
      component: () => import('../views/CaptureView.vue'),
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../views/IndexView.vue'),
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('../views/DetailView.vue'),
    },
    {
      path: '/font-test',
      name: 'font-test',
      component: () => import('../views/FontTestView.vue'),
    },
    {
      path: '/font-debug',
      name: 'font-debug',
      component: () => import('../views/FontDebugView.vue'),
    },
  ],
})

export default router
