<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// init
const mapRef = ref(null)  // DOM
const shanghai = ref({})
const downtown = ref({})
let chartInstance

const mapData = ref({})  // 不同行政区数据缓存

const initChart = async () => {
  chartInstance = echarts.init(mapRef.value, 'dark')

  // 获取上海矢量数据
  await fetch('/json/shanghai.json')
    .then((response) => response.json())
    .then((json) => {
      shanghai.value = json
    })
  // 获取市区矢量数据
  await fetch('/json/downtown.json')
    .then((response) => response.json())
    .then((json) => {
      downtown.value = json
    })

  // 将矢量数据注册到地图
  echarts.registerMap('shanghai', shanghai.value)
  echarts.registerMap('downtown', downtown.value)

  // 图表初始化配置
  const initOption = {
    title: [
      {
        text: '上海市全图',
        left: '42%',
        top: '88%'
      },
      {
        text: '市中心区全图',
        left: '82%',
        top: '88%'
      }
    ],
    geo: [
      {
        type: 'map',
        map: 'shanghai',
        itemStyle: {
          areaColor: '#2e72bf',
          borderColor: '#333'
        },
        left: '10%',
        top: '10%',
        zoom: 1.2
      },
      {
        type: 'map',
        map: 'downtown',
        itemStyle: {
          areaColor: '#2e72bf',
          borderColor: '#333'
        },
        left: '60%',
        top: '10%',
        zoom: 0.9
      }
    ]
  }
  chartInstance.setOption(initOption)

  // 监听地图点击
  chartInstance.on('click', async (arg) => {
    const selectedName = arg.name
    // 只监听左侧地图
    if (arg.componentIndex === 0) {
      // 获取这个区的数据
      if (!mapData.value[selectedName]) {
        await fetch(`/json/${selectedName}.json`)
          .then((response) => response.json())
          .then((json) => {
            // 将地图数据注册到echarts
            echarts.registerMap(selectedName, json)
            // 将地图数据添加到缓存
            mapData.value[selectedName] = json
          })
      }

      // 个性化定制
      let leftLevel = '60%'
      let zoomLevel = 0.9
      if (selectedName === '青浦区' || selectedName === '崇明区' || selectedName === '闵行区') {
        leftLevel = '50%'
      } else if (selectedName === '金山区' || selectedName === '奉贤区') {
        leftLevel = '45%'
        zoomLevel = 0.65
      } else if (selectedName === '松江区') {
        leftLevel = '55%'
        zoomLevel = 0.8
      } else if (selectedName === '普陀区' || selectedName === '长宁区') {
        leftLevel = '45%'
        zoomLevel = 0.7
      }

      // 更新右侧地图为选定的地图
      const changeOption = {
        title: [
          {},
          {
            text: selectedName,
          }
        ],
        geo: [
          {
            map: 'shanghai'
          },
          {
            map: selectedName, // 在这里使用选定的地图名称
            left: leftLevel,
            zoom: zoomLevel
          }
        ]
      }
      chartInstance.setOption(changeOption);
    }
  })
}


onMounted(() => {
  initChart()
})
</script>

<template>
  <div ref="mapRef"></div>
</template>

<style scoped lang="less"></style>