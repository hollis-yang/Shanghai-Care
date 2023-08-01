<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'


// init
const mapRef = ref(null)  // DOM
const downtown = ref({})
let chartInstance


const initChart = async () => {
  chartInstance = echarts.init(mapRef.value, 'dark')

  // 获取上海矢量数据
  await fetch('/json/downtown.json')
    .then((response) => response.json())
    .then((json) => {
      downtown.value = json
    })

  // 将矢量数据注册到地图
  echarts.registerMap('downtown', downtown.value)

  // 图表初始化配置
  const initOption = {
    backgroundColor: 'transparent',
    title: {
      text: '丨上海市中心城区老年人口密度',
      top: '0%'
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: 5000,
      max: 15000,
      itemHeight: 200,
      inRange: {
        color: [
          '#a3cfe0',
          '#75afd1',
          '#4575b4', // Medium blue
          '#2b4f8c', // Darker blue
          '#1a3870',
          '#0c0847' // Darkest blue
        ]
      },
      calculable: true,
      left: '5%',
      bottom: '10%'
    },
    series: [
      {
        type: 'map',
        map: 'downtown',
        itemStyle: {
          areaColor: '#2e72bf',
          borderColor: '#333'
        },
        zoom: 1
      }
    ]
  }
  chartInstance.setOption(initOption)
}


// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = `SELECT district, elder_density FROM old_pop
              WHERE district IN ('徐汇区', '长宁区', '黄浦区', '静安区', '虹口区', '普陀区', '杨浦区');`
  const res = await getSQLAPI(sql)

  sqlResult.value = res

  updateChart()
}


// update
const updateChart = () => {
  // 数据处理
  const seriesData = sqlResult.value.map(item => {
    return {
      name: item[0],
      value: item[1]
    }
  })

  const dataOption = {
    series: [
      {
        type: 'map',
        map: 'downtown',
        data: seriesData
      }
    ],
    tooltip: {
      formatter: '{b}: {c}人/km²'
    }
  }
  chartInstance.setOption(dataOption)
}


// 自适应
const screenAdapter = () => {
  const titleFontSize = mapRef.value.offsetWidth / 100 * 3.6

  const adapterOption = {
    title: [
      {
        textStyle: {
          fontSize: titleFontSize * 0.9
        }
      },
      {
        textStyle: {
          fontSize: titleFontSize * 0.8
        }
      }
    ]
  }
  chartInstance.setOption(adapterOption)

  chartInstance.resize()
}


onMounted(async () => {
  await initChart()
  getData()
  // 监听window大小变化以进行分辨率适配
  window.addEventListener('resize', screenAdapter)
  // 界面加载完成后主动进行分辨率适配
  screenAdapter()
})
onUnmounted(() => {
  // 组件销毁时取消事件监听
  window.removeEventListener('resize', screenAdapter)
})
</script>

<template>
  <div ref="mapRef"></div>
</template>

<style lang="less" scoped></style>