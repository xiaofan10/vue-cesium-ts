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
    path: '/SpecialEffects',
    name: 'SpecialEffects',
    meta: {
      title: 'SpecialEffects'
    },
    redirect: '/SpecialEffects/Rain',
    children: [
      {
        path: 'MenuSide',
        name: 'MenuSide',
        meta: {
          title: 'MenuSide'
        },
        component: () => import('@/views/SpecialEffects/MenuSide.vue')
      },
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
      },
      {
        path: 'Fly',
        name: 'Fly',
        meta: {
          title: 'Fly'
        },
        component: () => import('@/views/CesiumEffects/Fly.vue')
      },
      {
        path: 'Camera',
        name: 'Camera',
        meta: {
          title: 'Camera'
        },
        component: () => import('@/views/CesiumEffects/Camera.vue')
      },
      {
        path: 'Entity',
        name: 'Entity',
        meta: {
          title: 'Entity'
        },
        component: () => import('@/views/CesiumEffects/Entity.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
