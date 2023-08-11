import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      meta: {
        title: 'Index'
      },
      component: Index
    },
    {
      path: '/SpecialEffects',
      name: 'SpecialEffects',
      meta: {
        title: 'SpecialEffects'
      },
      redirect: '/SpecialEffects/Rain',
      children: [
        {
          path: 'Rain',
          name: 'Rain',
          meta: {
            title: 'Rain'
          },
          component: () => import('@/views/SpecialEffects/Rain.vue')
        },
        {
          path: 'Cube',
          name: 'Cube',
          meta: {
            title: 'Cube'
          },
          component: () => import('@/views/SpecialEffects/Cube.vue')
        }
      ]
    },
    {
      path: '/CesiumEffects',
      name: 'CesiumEffects',
      meta: {
        title: 'CesiumEffects'
      },
      redirect: '/CesiumEffects/Material',
      children: [
        {
          path: 'Material',
          name: 'Material',
          meta: {
            title: 'Material'
          },
          component: () => import('@/views/CesiumEffects/Material.vue')
        }
      ]
    }
  ]
})

export default router
