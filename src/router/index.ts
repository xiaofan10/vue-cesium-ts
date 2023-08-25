import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'

export const routes = [
  {
    path: '/',
    name: 'Index',
    meta: {
      title: 'Index'
    },
    component: Index
  },
  {
    path: '/Compo',
    name: 'Compo',
    meta: {
      title: 'Compo'
    },
    redirect: '/Compo/Refresh',
    children: [
      {
        path: 'Refresh',
        name: 'Refresh',
        meta: {
          title: 'Refresh'
        },
        component: () => import('@/views/Compo/Refresh/index.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
