<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// init
const educationRef = ref(null)  // DOM
let chartInstance
const timeId = ref(null)

const initChart = () => {
  chartInstance = echarts.init(educationRef.value, 'dark')

  // 图表初始化配置
  const initOption = {
    backgroundColor: 'transparent',
    title: {
      text: '丨护工学历分布',
      top: '2%'
    },
    grid: {
      left: '13%',
      right: '8%',
      bottom: '10%',
      top: '15%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        z: 0,
        lineStyle: {
          color: 'rgba(127, 127, 127, 0.3)',
          type: 'solid'
        }
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        rotate: 30
      }
    },
    series: [
      {
        type: 'bar'
      }
    ]
  }

  chartInstance.setOption(initOption)

  chartInstance.on('mouseover', () => {
    clearInterval(timeId.value)
  })
  chartInstance.on('mouseout', () => {
    startInterval()
  })
}


const startValue = ref(7)
const endValue = ref(3)
// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT education, number FROM education_nursing_workers"
  const res = await getSQLAPI(sql)

  sqlResult.value = res
  // 从大到小排序
  sqlResult.value.sort((a, b) => -b[1] + a[1])

  updateChart()

  startInterval()
}


// update
const updateChart = () => {
  // 颜色数组
  const colorArr = [
    ['#2e72bf', '#23e5e5'],
    ['#0ba82c', '#4ff778'],
    ['#5052ee', '#ab6ee5']
  ]

  // 数据处理
  // x(value)
  const xArr = sqlResult.value.map(item => item[0])
  // y(category)
  const yArr = sqlResult.value.map(item => item[1])

  // 图表数据配置
  const dataOption = {
    yAxis: {
      data: xArr
    },
    dataZoom: {
      show: false,
      yAxisIndex: 0,
      // 开始时展示4条
      startValue: startValue.value,
      endValue: endValue.value
    },
    series: [
      {
        data: yArr,
        itemStyle: {
          color: (arg) => {
            let targetArr = null
            if (arg.data > 10000) {
              targetArr = colorArr[0]
            } else if (arg.data > 5000) {
              targetArr = colorArr[1]
            } else {
              targetArr = colorArr[2]
            }
            return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: targetArr[0]
              },
              {
                offset: 1,
                color: targetArr[1]
              }
            ])
          }
        }
      }
    ]
  }
  chartInstance.setOption(dataOption)
}


// 平移柱状图定时器
const startInterval = () => {
  if (timeId.value) {
    clearInterval(timeId.value)
  }

  timeId.value = setInterval(() => {
    startValue.value--
    endValue.value--

    if (endValue.value < 0) {
      startValue.value = 7
      endValue.value = 3
    }

    updateChart()
  }, 3000);
}


const screenAdapter = () => {
  const titleFontSize = educationRef.value.offsetWidth / 100 * 3.6

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize * 1.7
      }
    },
    xAxis: {
      axisLabel: {
        textStyle: {
          fontSize: titleFontSize * 0.8
        }
      }
    },
    yAxis: {
      axisLabel: {
        textStyle: {
          fontSize: titleFontSize * 1
        }
      }
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: titleFontSize * 2.5
        }
      }
    },
    series: [
      {
        barWidth: titleFontSize * 2.5,
        itemStyle: {
          borderRadius: [0, titleFontSize * 2, titleFontSize * 2, 0]
        }
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
  clearInterval(timeId.value)
  // 组件销毁时取消事件监听
  window.removeEventListener('resize', screenAdapter)
})
</script>

<template>
  <div ref="educationRef"></div>
</template>

<style scoped lang="less"></style>