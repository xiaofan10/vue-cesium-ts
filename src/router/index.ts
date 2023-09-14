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
    path: '/EchartsEffects',
    name: 'EchartsEffects',
    meta: {
      title: 'EchartsEffects'
    },
    redirect: '/EchartsEffects/Map',
    children: [
      {
        path: 'Custom',
        name: 'Custom',
        meta: {
          title: 'Custom'
        },
        component: () => import('@/views/EchartsEffects/Custom.vue')
      },
      {
        path: 'Map',
        name: 'Map',
        meta: {
          title: 'Map'
        },
        component: () => import('@/views/EchartsEffects/Map.vue')
      },
      {
        path: 'BMap',
        name: 'BMap',
        meta: {
          title: 'BMap'
        },
        component: () => import('@/views/EchartsEffects/BMap.vue')
      },
      {
        path: 'Sankey',
        name: 'Sankey',
        meta: {
          title: 'Sankey'
        },
        component: () => import('@/views/EchartsEffects/Sankey.vue')
      },
      {
        path: 'Chart3',
        name: 'Chart3',
        meta: {
          title: 'Chart3'
        },
        component: () => import('@/views/EchartsEffects/Chart3.vue')
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
        path: 'Animate',
        name: 'Animate',
        meta: {
          title: 'Animate'
        },
        component: () => import('@/views/CesiumEffects/Animate.vue')
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
        path: 'CesiumMap',
        name: 'CesiumMap',
        meta: {
          title: 'CesiumMap'
        },
        component: () => import('@/views/CesiumEffects/Map.vue')
      },
      {
        path: 'ContourLine',
        name: 'ContourLine',
        meta: {
          title: 'ContourLine'
        },
        component: () => import('@/views/CesiumEffects/ContourLine.vue')
      },
      {
        path: 'Entity',
        name: 'Entity',
        meta: {
          title: 'Entity'
        },
        component: () => import('@/views/CesiumEffects/Entity.vue')
      },
      {
        path: 'OfflineMap',
        name: 'OfflineMap',
        meta: {
          title: 'OfflineMap'
        },
        component: () => import('@/views/CesiumEffects/OfflineMap.vue')
      },
      {
        path: 'Material',
        name: 'Material',
        meta: {
          title: 'Material'
        },
        component: () => import('@/views/CesiumEffects/Material.vue')
      },
      {
        path: 'Particle',
        name: 'Particle',
        meta: {
          title: 'Particle'
        },
        component: () => import('@/views/CesiumEffects/Particle.vue')
      },
      {
        path: 'Plane',
        name: 'Plane',
        meta: {
          title: 'Plane'
        },
        component: () => import('@/views/CesiumEffects/Plane.vue')
      },
      {
        path: 'Scene',
        name: 'Scene',
        meta: {
          title: 'Scene'
        },
        component: () => import('@/views/CesiumEffects/Scene.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
