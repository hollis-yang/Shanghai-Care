<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const districtRef = ref(null)  // DOM
let chartInstance

// 数组起终点
const startValue = ref(0)
const timeId = ref(null)  // 定时器ID(用于销毁定时器)

const initChart = () => {
  chartInstance = echarts.init(districtRef.value, 'dark')
  const initOption = {
    backgroundColor: 'transparent',
    color: ['#80FFA5', '#00DDFF', '#FF0087', '#FFBF00'],
    title: {
      text: '丨各区护工来源与户籍统计',
      top: '1%'
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

  sqlResult.value = res

  updateChart()

  startInterval()
}

const updateChart = () => {
  const colorArr1 = [
    'rgb(128, 255, 165)',
    'rgb(0, 221, 255)',
    'rgb(255, 0, 135)',
    'rgb(255, 191, 0)'
  ]
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
  const districtData = sqlResult.value.slice(startValue.value, startValue.value + 8)  // 获取某四个区的具体数据

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


// 分辨率适配
const screenAdapter = () => {
  const titleFontSize = districtRef.value.offsetWidth / 100 * 2.5

  // 图表分辨率相关参数配置
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize * 1.2
      }
    },
    legend: {
      itemWidth: titleFontSize * 1.1,
      itemHeight: titleFontSize * 1.1,
      itemGap: titleFontSize * 3 / 2,
      textStyle: {
        fontSize: titleFontSize / 4 * 3
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
  }
  chartInstance.setOption(adapterOption)

  chartInstance.resize()
}


// 定时器
const startInterval = () => {
  if (timeId.value) {
    clearInterval(timeId.value)
  }

  timeId.value = setInterval(() => {
    startValue.value += 8

    if (startValue.value === 32) {
      startValue.value = 0
    }

    updateChart()
  }, 3000)
}
const stopInterval = () => {
  clearInterval(timeId.value)
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
  <div ref="districtRef" @mouseover="stopInterval" @mouseout="startInterval"></div>
</template>

<style scoped lang="less"></style>