<script setup>
import { getSQLAPI } from '@/apis/mysql'
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'


// init
const workRef = ref(null)  // DOM
let chartInstance
const initChart = () => {
  chartInstance = echarts.init(workRef.value, 'dark')

  // 图表初始化配置
  const initOption = {
    backgroundColor: 'transparent',
    title: {
      text: '丨护理员工作经验统计',
      top: '5%',
      left: '7.8%'
    },
    legend: {
      top: 'bottom',
      icon: 'circle'
    },
    label: {
      show: true
    },
    tooltip: {
      show: 'true'
    },
    series: [
      {
        name: '护理员工作经验',
        type: 'pie',
        radius: ['20%', '70%'],
        center: ['50%', '54%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        }
      }
    ]
  }
  chartInstance.setOption(initOption)
}

// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT years, number FROM experience_nursing_workers"
  const res = await getSQLAPI(sql)

  sqlResult.value = res
  console.log(res)

  updateChart()
}


// update
const updateChart = () => {
  // 准备颜色
  const colorArr1 = [
    'rgba(35, 241, 79, 1)',
    'rgba(44, 110, 255, 1)',
    'rgba(22, 242, 217, 1)',
    'rgba(250, 105, 0, 1)',
    'rgba(239, 77, 133, 1)',
    'rgba(254, 76, 72, 1)'
  ]
  const colorArr2 = [
    'rgba(35, 241, 79, 0.3)',
    'rgba(44, 110, 255, 0.3)',
    'rgba(22, 242, 217, 0.3)',
    'rgba(250, 105, 0, 0.3)',
    'rgba(239, 77, 133, 0.3)',
    'rgba(254, 76, 72, 0.3)'
  ]


  // 数据处理
  const seriesData = sqlResult.value.map((item, index) => {
    return {
      value: item[1],
      name: item[0],
      itemStyle: {
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
      }
    }
  })

  const dataOption = {
    series: [
      {
        data: seriesData
      }
    ]
  }
  chartInstance.setOption(dataOption)
}


// 自适应
const screenAdapter = () => {
  const titleFontSize = workRef.value.offsetWidth / 100 * 3.6

  const adaptOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize * 1.4
      }
    },
    legend: {
      itemWidth: titleFontSize * 0.8,
      itemHeight: titleFontSize * 0.8,
      itemGap: titleFontSize / 2,
      textStyle: {
        fontSize: titleFontSize * 2 / 3
      }
    },
    label: {
      fontSize: titleFontSize * 0.75
    }
  }
  chartInstance.setOption(adaptOption)

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
  <div ref="workRef"></div>
</template>

<style scoped lang="less"></style>