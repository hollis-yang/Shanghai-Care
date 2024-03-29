<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'


// init
const ageRef = ref(null)  // DOM
let chartInstance
const initChart = () => {
  chartInstance = echarts.init(ageRef.value, 'dark')

  // 图表初始化配置
  const initOption = {
    backgroundColor: 'transparent',
    title: {
      text: '丨护工年龄分布',
      top: '5%'
    },
    legend: {
      top: '16%',
      icon: 'circle',
      left: '10%',
      right: '10%'
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '65%'],
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 700
          }
        },
        labelLine: {
          show: false
        },
        center: ['50%', '67%'],
        itemStyle: {
          borderRadius: 8,
          borderColor: 'rgba(127, 127, 127, 0.5)',
          borderWidth: 2
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

  sqlResult.value = res

  updateChart()
}


// update
const updateChart = function () {
  // 准备颜色
  const colorArr1 = ['rgb(128, 255, 165)', 'rgb(0, 221, 255)', 'rgb(55, 162, 255)', 'rgb(255, 191, 0)', 'rgb(255, 0, 135)']
  const colorArr2 = ['rgb(1, 191, 236)', 'rgb(77, 119, 255)', 'rgb(116, 21, 219)', 'rgb(224, 62, 76)', 'rgb(135, 0, 157)']

  // 数据处理
  const seriesData = sqlResult.value.map((item, index) => {
    return {
      name: item[0],
      value: item[1],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorArr1[index] },
          { offset: 1, color: colorArr2[index] }
        ])
      }
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


// 自适应
const titleFontSize = ref(0)
const screenAdapter = () => {
  titleFontSize.value = ageRef.value.offsetWidth / 100 * 3.6

  const adaptOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value * 1.7
      }
    },
    legend: {
      itemWidth: titleFontSize.value * 1.1,
      itemHeight: titleFontSize.value * 1.1,
      itemGap: titleFontSize.value,
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    series: [
      {
        emphasis: {
          label: {
            fontSize: titleFontSize.value * 2.1
          }
        }
      }
    ]
  }
  chartInstance.setOption(adaptOption)

  chartInstance.resize()
}

// 挂载
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
  <div ref="ageRef">
  </div>
</template>

<style scoped lang="less"></style>