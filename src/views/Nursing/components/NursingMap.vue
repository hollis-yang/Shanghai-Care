<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'


// init
const mapRef = ref(null)  // DOM
const shanghai = ref({})
const downtown = ref({})
let chartInstance


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
    backgroundColor: 'transparent',
    title: [
      {
        text: '全市16区',
        left: '32%',
        top: '92%'
      },
      {
        text: '市中心7区',
        left: '67%',
        top: '92%'
      }
    ],
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      right: '4%',
      top: 'bottom',
      orient: 'vertical',
      itemHeight: 200,
      min: 0,
      max: 15000,
      inRange: {
        color: [
          '#e0f3f8', // Lightest blue
          '#74add1',
          '#4575b4',
          '#313695',
          '#0c0847' // Darkest blue
        ]
      },
      calculable: true
    },
    series: [
      {
        type: 'map',
        map: 'shanghai',
        itemStyle: {
          areaColor: '#2e72bf',
          borderColor: '#333'
        },
        left: '5%',
        top: '13%',
        zoom: 1.1
      },
      {
        type: 'map',
        map: 'downtown',
        itemStyle: {
          areaColor: '#2e72bf',
          borderColor: '#333'
        },
        left: '55%',
        top: '13%',
        zoom: 0.9
      }
    ]
  }
  chartInstance.setOption(initOption)
}


// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = `SELECT 
  district, 
  SUM(institution_number) AS total_institution_number,
  SUM(community_number) AS total_community_number,
  SUM(station_number) AS total_station_number
  FROM district_nursing_workers
  GROUP BY district; `
  const res = await getSQLAPI(sql)

  sqlResult.value = res

  updateChart()
}


// update
const updateChart = () => {
  // 数据处理
  const seriesData1 = sqlResult.value.map(item => {
    return {
      name: item[0],
      value: Number(item[1]) + Number(item[2]) + Number(item[3])
    }
  })

  const downtownDistricts = ['徐汇区', '长宁区', '黄浦区', '静安区', '虹口区', '普陀区', '杨浦区']
  const seriesData2 = sqlResult.value.map(item => {
    if (downtownDistricts.includes(item[0])) {
      return {
        name: item[0],
        value: Number(item[1]) + Number(item[2]) + Number(item[3])
      }
    }
  }).filter(item => item !== undefined)

  const dataOption = {
    series: [
      {
        type: 'map',
        map: 'shanghai',
        data: seriesData1
      },
      {
        type: 'map',
        map: 'downtown',
        data: seriesData2
      }
    ],
    tooltip: {
      formatter: '{b}: {c}人'
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
          fontSize: titleFontSize * 0.8
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

<style scoped lang="less">
</style>