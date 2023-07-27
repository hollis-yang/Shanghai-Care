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
        text: '上海市地图',
        left: '42%',
        top: '88%'
      },
      {
        text: '上海市区',
        left: '85%',
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
        top: '10%'
      }
    ]
  }
  chartInstance.setOption(initOption)

  // 监听地图点击
  chartInstance.on('click', async (arg) => {
    console.log(arg)
    // 只监听左侧地图
    if (arg.componentIndex === 0) {
      // 获取这个区的数据
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