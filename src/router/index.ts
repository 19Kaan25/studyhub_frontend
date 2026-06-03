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
      path: '/demo',
      name: 'demo',
      component: () => import('../views/DemoView.vue'),
    },
    {
      path: '/resources',
      name: 'resource-create',
      component: () => import('../views/ResourceCreateView.vue'),
    },
    {
      path: '/resources/:id',
      name: 'resource-detail',
      component: () => import('../views/ResourceDetailView.vue'),
    },
  ],
})

export default router
