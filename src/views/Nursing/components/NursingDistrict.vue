<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const districtRef = ref(null)  // DOM
let chartInstance
const initChart = () => {
  chartInstance = echarts.init(districtRef.value, 'dark')
  const initOption = {
    color: ['#80FFA5', '#00DDFF', '#FF0087', '#FFBF00'],
    title: {
      text: '丨各区护工来源与户籍统计',
      top: '5%'
    },
    legend: {
      left: '40%',
      top: '5%'
    },
    grid: {
      containLabel: true, // 使距离包含坐标轴上的label文字
      left: '8%',
      right: '8%',
      top: '20%',
      bottom: '2%'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,  // 折线和坐标轴没有间隙
      axisLabel: {
        rotate: 30 // 旋转角度
      }
    },
    yAxis: {
      type: 'value'
    }
  }

  chartInstance.setOption(initOption)
}

// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT * FROM district_nursing_workers"
  const res = await getSQLAPI(sql)
  console.log(res)
  sqlResult.value = res

  updateChart()
}

const updateChart = () => {
  const colorArr1 = [
    'rgb(128, 255, 165)',
    'rgb(0, 221, 255)',
    'rgb(255, 0, 135)',
    'rgb(255, 191, 0)'
  ]
  // 全透明的颜色值
  const colorArr2 = [
    'rgb(1, 191, 236)',
    'rgb(77, 119, 255)',
    'rgb(135, 0, 157)',
    'rgb(224, 62, 76)'
  ]

  // 数据处理
  // x轴
  const xArr = ['养老机构(上海籍)', '社区(上海籍)', '护理站(上海籍)', '养老机构(非上海籍)', '社区(非上海籍)', '护理站(非上海籍)']
  // y轴
  const districtData = sqlResult.value.splice(2, 8)  // 获取某四个区的具体数据

  let districtName = districtData.map(item => item[1])
  districtName = [...new Set(districtName)]

  const yData = districtData.map((item) => {
    return item.slice(3, 6)
  })
  const yArr = []
  for (let i = 0; i < yData.length; i += 2) {
    if (i + 1 < yData.length) {
      yArr.push([...yData[i], ...yData[i + 1]])
    }
  }


  const seriesArr = yArr.map((item, index) => {
    return {
      name: districtName[index],
      type: 'line',
      data: Array.from(item),
      stack: 'district',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 0
      },
      areaStyle: {
        opacity: 0.7,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colorArr1[index]
          },
          {
            offset: 1,
            color: colorArr2[index]
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
    }
  })

  // 图表数据配置
  const dataOption = {
    xAxis: {
      data: xArr
    },
    series: seriesArr,
    legend: {
      data: districtName
    }
  }
  chartInstance.setOption(dataOption)
}

onMounted(() => {
  initChart()
  getData()
})
</script>

<template>
  <div ref="districtRef"></div>
</template>

<style scoped lang="less"></style>