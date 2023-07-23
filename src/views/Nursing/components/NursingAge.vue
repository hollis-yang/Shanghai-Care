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
    title: {
      text: '丨护工年龄分布',
      top: '5%'
    },
    legend: {
      top: '18%',
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
          borderRadius: 8,
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


// 自适应
const titleFontSize = ref(0)
const screenAdapter = () => {
  titleFontSize.value = ageRef.value.offsetWidth / 100 * 3.6

  const adaptOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value * 2
      }
    },
    legend: {
      itemWidth: titleFontSize.value * 1.5,
      itemHeight: titleFontSize.value * 1.5,
      itemGap: titleFontSize.value / 3 * 2,
      textStyle: {
        fontSize: titleFontSize.value * 1.2
      }
    },
    series: [
      {
        radius: titleFontSize.value * 8
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