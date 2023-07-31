<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const elRef = ref(null)  // DOM
let chartInstance

const initChart = () => {
  chartInstance = echarts.init(elRef.value, 'dark')
  const initOption = {
    backgroundColor: 'transparent',
    animationDuration: 5000,
    dataset: [
      {
        id: 'dataset_raw',
      }
    ],
    title: {
      text: '丨上海市人口预期寿命变化',
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: '21%',
      bottom: '13%',
      left: '6%',
      right: '0%'
    },
    legend: {
      orient: 'horizontal',
      top: '1%',
      left: '45%'
    },
    xAxis: {
      type: 'category',
      name: '年份',
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '预期寿命',
      min: 70,
      max: 90
    },
  }
  chartInstance.setOption(initOption)
}


// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT year, total, male, female FROM life_expectancy"
  const res = await getSQLAPI(sql)

  sqlResult.value = res
  // 反转数组(2022在最后)
  sqlResult.value = sqlResult.value.reverse()

  updateChart()
}


const updateChart = () => {
  // 数据处理

  // 男女分开的数据
  const MFData = sqlResult.value.map(item => {
    return {
      year: item[0],
      MExpectancy: item[2],
      FExpectancy: item[3]
    }
  })
  console.log(MFData)

  const dataOption = {
    dataset: [
      {
        source: MFData
      }
    ],
    xAxis: {
      data: MFData.map(item => item.year)
    },
    legend: {
      data: ['男性预期寿命', '女性预期寿命']
    },
    series: [
      {
        type: 'line',
        datasetId: 'dataset_raw',
        showSymbol: true,
        name: '男性预期寿命',
        encode: {
          x: 'year',
          y: 'MExpectancy'
        },
        smooth: true
      },
      {
        type: 'line',
        datasetId: 'dataset_raw',
        showSymbol: true,
        name: '女性预期寿命',
        encode: {
          x: 'year',
          y: 'FExpectancy'
        },
        smooth: true
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
  <div ref="elRef"></div>
</template>

<style lang="less" scoped></style>