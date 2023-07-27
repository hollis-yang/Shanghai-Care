<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const districtRef = ref(null)  // DOM
let chartInstance
const initChart = () => {
  chartInstance = echarts.init(districtRef.value, 'dark')
  const initOption = {}
  
  chartInstance.setOption(initOption)
}

// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT * FROM district_nursing_workers"
  const res = await getSQLAPI(sql)
  console.log(res)
  sqlResult.value = res

  // updateChart()
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