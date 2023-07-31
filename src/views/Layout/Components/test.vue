<template>
  <div ref="elRef"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const elRef = ref(null) // DOM
let chartInstance
let endLabelFormatter // 保存 endLabel 的 formatter 函数

const initChart = () => {
  chartInstance = echarts.init(elRef.value, 'dark')
  // ... 省略其他初始化代码 ...
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
  });

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
        lineStyle: {
          color: '#5E83BA',
          width: 3
        },
        itemStyle: {
          color: '#5E83BA'
        },
        smooth: true,
        endLabel: {
          show: true,
          formatter: endLabelFormatter // 使用保存的 formatter 函数
        }
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
        smooth: true,
        lineStyle: {
          color: '#F9677F',
          width: 3
        },
        itemStyle: {
          color: '#F9677F'
        }
      }
    ]
  };

  chartInstance.setOption(dataOption);
};

onMounted(() => {
  initChart()
  getData()
})
</script>

<style lang="less" scoped></style>
