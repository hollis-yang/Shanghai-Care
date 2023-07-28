<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// init
const licenseRef = ref(null)  // DOM
let chartInstance

const initChart = () => {
  chartInstance = echarts.init(licenseRef.value, 'dark')

  // 图表初始化配置
  const initOption = {
    backgroundColor: 'transparent',
    title: {
      text: '丨养老护理员持证情况',
      top: '2%',
      left: '0%'
    },
    grid: {
      left: '13%',
      right: '9%',
      top: '17%',
      bottom: '11%'
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      max: 50000
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
    series: [
      {
        name: '养老护理员持证情况',
        type: 'bar',
        markPoint: {
          symbolSize: 65,
          data: [
            {
              type: 'max',
              name: '最大人数'
            },
            {
              type: 'min',
              name: '最小人数'
            }
          ]
        },
        markLine: {
          data: [
            {
              type: 'average',
              name: '平均人数',
            }
          ],
          precision: 0
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
      }
    ]
  }
  chartInstance.setOption(initOption)
}


// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT certificate, number FROM certificate_nursing_workers"
  const res = await getSQLAPI(sql)

  sqlResult.value = res

  updateChart()

}


// update
const updateChart = () => {
  // x(value)
  const xArr = sqlResult.value.map(item => item[0])
  // y(category)
  const yArr = sqlResult.value.map(item => item[1])

  // 图表数据配置
  const dataOption = {
    xAxis: {
      data: xArr
    },
    series: [
      {
        data: yArr
      }
    ]
  }
  chartInstance.setOption(dataOption)
}


// 分辨率适配
const screenAdapter = () => {
  const titleFontSize = licenseRef.value.offsetWidth / 100 * 2.5

  // 图表分辨率相关参数配置
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize * 2.4
      }
    },
    xAxis: {
      axisLabel: {
        textStyle: {
          fontSize: titleFontSize
        }
      }
    },
    yAxis: {
      axisLabel: {
        textStyle: {
          fontSize: titleFontSize * 1.1
        }
      }
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: titleFontSize * 3
        }
      }
    },
    series: [
      {
        barWidth: titleFontSize * 3,
        itemStyle: {
          borderRadius: [titleFontSize, titleFontSize, 0, 0]
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
  // 组件销毁时取消事件监听
  window.removeEventListener('resize', screenAdapter)
})
</script>

<template>
  <div ref="licenseRef"></div>
</template>

<style scoped lang="less"></style>