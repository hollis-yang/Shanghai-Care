<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'


// init
const ageRef = ref(null)  // DOM
let chartInstance
const initChart = () => {
  chartInstance = echarts.init(ageRef.value, 'dark')

  // 图表初始化配置
  const initOption = {
    title: {
      text: '丨护工年龄分布',
      top: '5%'
    },
    legend: {
      top: '15%',
      icon: 'circle',
      left: '10%'
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        center: ['50%', '65%'],
        itemStyle: {
          borderRadius: 5,
        }
      }
    ]
  }
  chartInstance.setOption(initOption)
}

// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT age_group, number FROM age_nursing_workers"
  const res = await getSQLAPI(sql)
  console.log(res)
  sqlResult.value = res

  updateChart()
}


// update
const updateChart = function () {
  // 数据处理
  const seriesData = sqlResult.value.map(item => {
    return {
      name: item[0],
      value: item[1]
    }
  })
  const legendData = sqlResult.value.map(item => {
    return item[0]
  })

  const dataOption = {
    legend: {
      legendData
    },
    series: [
      {
        data: seriesData
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
  <div ref="ageRef">
  </div>
</template>

<style scoped lang="less"></style>