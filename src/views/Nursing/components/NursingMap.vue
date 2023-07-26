<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// init
const mapRef = ref(null)  // DOM
const shanghai = ref([])
let chartInstance

const initChart = async () => {
  chartInstance = echarts.init(mapRef.value, 'dark')

  // 获取上海矢量数据
  const sql = "SELECT district, data FROM shanghai WHERE district = 'all';"
  const res = await getSQLAPI(sql)
  console.log(res[0][1])
  shanghai.value = res[0][1]


  // 将矢量数据注册到地图
  echarts.registerMap('shanghai', shanghai.value)

  // 图表初始化配置
  const initOption = {
    geo: [
      {
        type: 'map',
        map: 'shanghai',
        itemStyle: {
          areaColor: '#2e72bf',
          borderColor: '#333'
        },
        zoom:1.2
      }
    ]
  }
  chartInstance.setOption(initOption)
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div ref="mapRef"></div>
</template>

<style scoped lang="less"></style>