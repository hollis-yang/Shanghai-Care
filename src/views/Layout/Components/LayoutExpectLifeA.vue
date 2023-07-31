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
    animation: true,
    animationDuration: 5000,
    title: {
      text: '丨上海市人口预期寿命变化',
      top: '0%'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: '26%',
      bottom: '13%',
      left: '6%',
      right: '10%'
    },
    legend: {
      orient: 'horizontal',
      top: '1%',
      left: '50%'
    },
    xAxis: {
      type: 'category',
      // name: '年份',
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      // name: '预期寿命',
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

const MData = ref([])
const FData = ref([])
const updateChart = () => {
  // 数据处理

  // 年份信息
  const yearData = sqlResult.value.map(item => item[0])
  // 男的数据
  MData.value = sqlResult.value.map(item => item[2])
  // 女的数据
  FData.value = sqlResult.value.map(item => item[3])


  const dataOption = {
    xAxis: {
      data: yearData
    },
    legend: {
      data: ['男性预期寿命', '女性预期寿命']
    },
    series: [
      {
        type: 'line',
        data: MData.value,
        showSymbol: true,
        symbolSize: elRef.value.offsetWidth / 100 * 3.6 * 0.5,
        name: '男性预期寿命',
        encode: {
          x: 'year',
          y: 'MExpectancy'
        },
        lineStyle: {
          color: '#5E83BA',
          width: elRef.value.offsetWidth / 100 * 3.6 * 0.15
        },
        itemStyle: {
          color: '#5E83BA'
        },
        smooth: true,
        endLabel: {
          show: true,
          formatter: ' 男: {c}',
          fontSize: elRef.value.offsetWidth / 100 * 3.6 * 0.7
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        type: 'line',
        data: FData.value,
        showSymbol: true,
        symbolSize: elRef.value.offsetWidth / 100 * 3.6 * 0.5,
        name: '女性预期寿命',
        encode: {
          x: 'year',
          y: 'FExpectancy'
        },
        smooth: true,
        lineStyle: {
          color: '#F9677F',
          width: elRef.value.offsetWidth / 100 * 3.6 * 0.15
        },
        itemStyle: {
          color: '#F9677F'
        },
        endLabel: {
          show: true,
          formatter: ' 女: {c}',
          fontSize: elRef.value.offsetWidth / 100 * 3.6 * 0.7
        },
        emphasis: {
          focus: 'series'
        },
      }
    ]
  }
  chartInstance.setOption(dataOption)
}


const screenAdapter = () => {
  const titleFontSize = elRef.value.offsetWidth / 100 * 3.6

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    xAxis: {
      axisLabel: {
        textStyle: {
          fontSize: titleFontSize * 0.7
        }
      }
    },
    yAxis: {
      axisLabel: {
        textStyle: {
          fontSize: titleFontSize * 0.7
        }
      }
    },
    legend: {
      textStyle: {
        fontSize: titleFontSize * 0.7
      }
    },
    series: [
      {
        showSymbol: true,
        symbolSize: elRef.value.offsetWidth / 100 * 3.6 * 0.5,
        endLabel: {
          fontSize: titleFontSize * 0.7
        },
        lineStyle: {
          color: '#5E83BA',
          width: elRef.value.offsetWidth / 100 * 3.6 * 0.15
        },
      },
      {
        showSymbol: true,
        symbolSize: elRef.value.offsetWidth / 100 * 3.6 * 0.5,
        endLabel: {
          fontSize: titleFontSize * 0.7
        },
        lineStyle: {
          color: '#F9677F',
          width: elRef.value.offsetWidth / 100 * 3.6 * 0.15
        },
      }
    ]
  }

  chartInstance.setOption(adapterOption)

  chartInstance.resize()
}

onMounted(() => {
  initChart()
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
  <div ref="elRef"></div>
</template>

<style lang="less" scoped></style>