<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const districtRef = ref(null)  // DOM
let chartInstance

const initChart = () => {
  chartInstance = echarts.init(districtRef.value, 'dark')
  const initOption = {
    // backgroundColor: 'transparent',
    title: {
      text: '|各区不同年龄段老年人口数量与占比',
    },
    grid: {
      containLabel: true,
      bottom: '0%',
      left: '4%',
      right: '7%',
      top: '25%'
    },
    tooltop: {
      show: true
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '60岁以上人口数',
        min: 15,
        max: 120,
        interval: 15
      },
      {
        type: 'value',
        name: '60岁以上人口占比',
        min: 24,
        max: 45,
        interval: 3
      }
    ],
    series: [
      {
        name: '60岁以上人口数',
        type: 'bar'
      },
      {
        name: '60岁以上人口占比',
        type: 'line',
        yAxisIndex: 1
      }
    ]
  }
  chartInstance.setOption(initOption)
}


// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = `SELECT district, pop_60, percent_60
              FROM old_pop
              WHERE district <> '全市';`
  const res = await getSQLAPI(sql)

  sqlResult.value = res
  console.log(res)
  updateChart()
}

const updateChart = () => {
  // 数据处理
  const xArr = sqlResult.value.map(item => item[0])
  const barArr = sqlResult.value.map(item => item[1])
  const lineArr = sqlResult.value.map(item => item[2])
  console.log(barArr)
  console.log(lineArr)

  const dataOption = {
    xAxis: {
      data: xArr
    },
    series: [
      {
        name: '60岁以上人口数',
        data: barArr
      },
      {
        name: '60岁以上人口占比',
        data: lineArr,
      }
    ]
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

<style lang="less" scoped></style>