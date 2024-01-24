<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const ageRef = ref(null)  // DOM
let chartInstance

const initChart = () => {
  chartInstance = echarts.init(ageRef.value, 'dark')
  const initOption = {
    backgroundColor: 'transparent',
    title: {
      text: '丨各年龄段老年人口数量与性别构成'
    },
    color: ['rgb(37, 117, 252)', 'rgb(255, 0, 135)'],
    grid: {
      bottom: '7%',
      right: '5%',
      left: '11.5%',
      top: '10%'
    },
    legend: {
      data: ['男', '女'],
      top: '12%',
      right: '8%'
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
      },
      formatter: function (data) {
        let ttt = data[0].name + '岁'
        for (let i = 0; i < data.length; i++) {
          ttt += '<br/>' + data[i].seriesName + '：' + Math.abs(data[i].value) + '万人'
        }
        return ttt
      },
    },
    xAxis: [
      {
        type: 'value',
        min: -100,
        max: 100,
        axisLabel: {
          formatter: (val) => {
            return val !== 0 ? Math.abs(val) + 'w' : Math.abs(val)
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        nameLocation: 'middle'
      }
    ],
    series: [
      {
        name: '男',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(37, 117, 252, 0.7)' },
            { offset: 1, color: 'rgb(37, 117, 252)' }
          ])
        },
      },
      {
        name: '女',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgb(255, 0, 135)' },
            { offset: 1, color: 'rgb(255, 0, 135, 0.7)' }
          ])
        },
      }
    ]
  }
  chartInstance.setOption(initOption)
}

// SQL
const sqlResult = ref([])
const getData = async () => {
  const sql = "SELECT * FROM old_gender;"
  const res = await getSQLAPI(sql)

  sqlResult.value = res
  console.log(res)
  updateChart()
}

const updateChart = () => {
  // 数据处理

  // 性别为男的各年龄段人数
  const maleArr = sqlResult.value.map(item => -item[3])
  // 性别为女的各年龄段人数
  const femaleArr = sqlResult.value.map(item => item[4])
  // 各年龄段
  const ageArr = sqlResult.value.map(item => item[1])

  const dataOption = {
    yAxis: {
      data: ageArr
    },
    series: [
      {
        name: '男',
        data: maleArr
      },
      {
        name: '女',
        data: femaleArr
      }
    ]
  }
  chartInstance.setOption(dataOption)
}


const screenAdapter = () => {
  const titleFontSize = ageRef.value.offsetWidth / 100 * 3.6

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize * 1.1
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
          fontSize: titleFontSize * 0.8
        }
      }
    },
    legend: {
      textStyle: {
        fontSize: titleFontSize * 0.9
      },
      itemGap: titleFontSize * 1.5
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: titleFontSize * 1.1
        }
      }
    },
    series: [
    {
        barWidth: titleFontSize * 1.1,
        itemStyle: {
          borderRadius: [titleFontSize, 0, 0, titleFontSize]
        }
      },
      {
        barWidth: titleFontSize * 1.1,
        itemStyle: {
          borderRadius: [0, titleFontSize, titleFontSize, 0]
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
  <div ref="ageRef"></div>
</template>

<style lang="less" scoped></style>