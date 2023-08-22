<template>
  <div class="sheet" ref="sheet"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import northEastGeoJson from '@/assets/geo/northEastGeo.json'
import 'echarts/extension/bmap/bmap'

const sheet = ref<HTMLDivElement>()
onMounted(() => {
  const chart = echarts.init(sheet.value)
  echarts.registerMap('northEast', northEastGeoJson as any)
  chart.setOption({
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 5,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#044161'
            }
          },
          {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#004981'
            }
          },
          {
            featureType: 'boundary',
            elementType: 'geometry',
            stylers: {
              color: '#064f85'
            }
          },
          {
            featureType: 'railway',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'highway',
            elementType: 'geometry',
            stylers: {
              color: '#004981'
            }
          },
          {
            featureType: 'highway',
            elementType: 'geometry.fill',
            stylers: {
              color: '#005b96',
              lightness: 1
            }
          },
          {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'geometry',
            stylers: {
              color: '#004981'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'geometry.fill',
            stylers: {
              color: '#00508b'
            }
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'green',
            elementType: 'all',
            stylers: {
              color: '#056197',
              visibility: 'off'
            }
          },
          {
            featureType: 'subway',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'manmade',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'local',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'boundary',
            elementType: 'geometry.fill',
            stylers: {
              color: '#029fd4'
            }
          },
          {
            featureType: 'building',
            elementType: 'all',
            stylers: {
              color: '#1a5787'
            }
          },
          {
            featureType: 'label',
            elementType: 'all',
            stylers: {
              visibility: 'on'
            }
          }
        ]
      }
    },
    series: [
      {
        name: 'pm2.5',
        type: 'scatter',
        roam: true,
        coordinateSystem: 'bmap',
        emphasis: {
          label: {
            show: true
          }
        },
        data: []
      }
    ]
  })
})
</script>

<style lang="less" scoped>
.sheet {
  width: 100%;
  height: 100%;
}
</style>
