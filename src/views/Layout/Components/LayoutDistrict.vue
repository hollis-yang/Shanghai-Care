<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const districtRef = ref(null)  // DOM
let chartInstance
const timeId = ref(null)

// 颜色数组
const colorArr = [
  ['#2e72bf', '#23e5e5'],
  ['#5052ee', '#ab6ee5'],
  ['#0ba82c', '#4ff778'],
]


const initChart = () => {
  chartInstance = echarts.init(districtRef.value, 'dark')

  const initOption = {
    backgroundColor: 'transparent',
    title: {
      text: '丨各区老年人口数量及其占比',
    },
    grid: {
      containLabel: true,
      bottom: '0%',
      left: '10%',
      right: '8%',
      top: '25%'
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
      type: 'category'
    },
    yAxis: [
      {
        type: 'value',
        name: '60岁以上人口数（万）',
      },
      {
        type: 'value',
        name: '60岁以上人口占比（%）',
      }
    ],
    series: [
      {
        name: '60岁以上人口数（万）',
        type: 'bar',
        itemStyle: {
          color: (arg) => {
            let targetArr = null
            if (arg.data > 40) {
              targetArr = colorArr[0]
            } else if (arg.data > 20) {
              targetArr = colorArr[1]
            } else {
              targetArr = colorArr[2]
            }
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
      },
      {
        name: '60岁以上人口占比（%）',
        type: 'line',
        yAxisIndex: 1,
        lineStyle: {
          color: '#ff6347'
        },
        itemStyle: {
          color: '#ff6347'
        }
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

const startValue = ref(0)
const endValue = ref(5)
// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = `SELECT district, pop_60, percent_60
              FROM old_pop
              WHERE district <> '全市';`
  const res = await getSQLAPI(sql)

  sqlResult.value = res
  updateChart()

  startInterval()
}

const updateChart = () => {
  // 数据处理
  const xArr = sqlResult.value.map(item => item[0])
  const barArr = sqlResult.value.map(item => item[1])
  const lineArr = sqlResult.value.map(item => item[2])

  // 最大最小
  const usedBarArr = barArr.slice(startValue.value, endValue.value + 1)
  const minBar = Math.min(...usedBarArr)
  const maxBar = Math.max(...usedBarArr)

  const usedLineArr = lineArr.slice(startValue.value, endValue.value + 1)
  const minLine = Math.min(...usedLineArr)
  const maxLine = Math.max(...usedLineArr)

  const dataOption = {
    dataZoom: {
      show: false,
      // 每次展示6个区
      startValue: startValue.value,
      endValue: endValue.value
    },
    xAxis: {
      data: xArr
    },
    yAxis: [
      {
        min: (minBar - 10).toFixed(0),
        max: (maxBar + 10).toFixed(0),
        interval: ((maxBar + 10).toFixed(0) - (minBar - 10).toFixed(0)) / 5
      },
      {
        min: (minLine - 10).toFixed(0),
        max: (maxLine + 10).toFixed(0),
        interval: ((maxLine + 10).toFixed(0) - (minLine - 10).toFixed(0)) / 5
      }
    ],
    series: [
      {
        name: '60岁以上人口数（万）',
        data: barArr
      },
      {
        name: '60岁以上人口占比（%）',
        data: lineArr,
        smooth: true,

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
    startValue.value += 2
    endValue.value += 2

    if (endValue.value >= 16) {
      startValue.value = 0
      endValue.value = 5
    }

    updateChart()
  }, 3000);
}


// 屏幕适配
const screenAdapter = () => {
  const titleFontSize = districtRef.value.offsetWidth / 100 * 3.6

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize * 0.9
      }
    },
    xAxis: {
      axisLabel: {
        textStyle: {
          fontSize: titleFontSize * 0.6
        }
      }
    },
    yAxis: [
      {
        axisLabel: {
          textStyle: {
            fontSize: titleFontSize * 0.6
          }
        },
        nameTextStyle: {
          fontSize: titleFontSize * 0.6
        }
      },
      {
        axisLabel: {
          textStyle: {
            fontSize: titleFontSize * 0.6
          }
        },
        nameTextStyle: {
          fontSize: titleFontSize * 0.6
        }
      }
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: titleFontSize * 1.5
        }
      }
    },
    series: [
      {
        barWidth: titleFontSize * 1.5,
        itemStyle: {
          borderRadius: [titleFontSize / 3 * 2, titleFontSize / 3 * 2, 0, 0]
        }
      },
      {
        symbolSize: titleFontSize * 0.4
      },
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
  <div ref="districtRef"></div>
</template>

<style lang="less" scoped></style>