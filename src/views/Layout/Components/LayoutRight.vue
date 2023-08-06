<script setup>
// 筛选框+表格代码
import { districtOptions } from '@/utils/district'
import { onMounted, ref, onUnmounted, watch } from 'vue'

const selectorValue = ref('Shanghai')  // 当前筛选框选中了哪个区


// echarts 代码
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'


// init
const pieRef = ref(null)
let chartInstance
const initChart = () => {
  chartInstance = echarts.init(pieRef.value, 'dark')

  // 图表初始化配置
  const initOption = {
    backgroundColor: 'transparent',
    title: [
      {
        top: '0'
      }
    ],
    legend: {
      icon: 'circle',
      top: '10%',
      left: '0',
      right: '0'
    },
    series: [
      {
        type: 'pie',
        label: {
          show: false
        },
        center: ['50%', '63%'],
        radius: ['50%', '70%'],
        itemStyle: {
          borderRadius: 5,
          borderColor: 'rgba(127, 127, 127, 0.3)',
          borderWidth: 2
        }
      }
    ]
  }
  chartInstance.setOption(initOption)
}

// SQL
const hcResult = ref([])
const hcSumResult = ref([])
const lcResult = ref([])
const lcSumResult = ref([])

let hcData_sum
let lcData_sum

const getData = async () => {
  const sql1 = `SELECT
              district,
              healthy_m + healthy_f AS hc_category1,
              basichealth_m + basichealth_f AS hc_category2,
              sickability_m + sickability_f AS hc_category3,
              inability_m + inability_f AS hc_category4
              FROM health_condition;`
  const res1 = await getSQLAPI(sql1)

  const sql2 = `SELECT 
                SUM(healthy_m) + SUM(healthy_f) AS hc_category1_sum,
                SUM(basichealth_m) + SUM(basichealth_f) AS hc_category2_sum,
                SUM(sickability_m) + SUM(sickability_f) AS hc_category3_sum,
                SUM(inability_m) + SUM(inability_f) AS hc_category4_sum
                FROM health_condition;`
  const res2 = await getSQLAPI(sql2)
  hcResult.value = res1
  hcSumResult.value = res2

  const sql3 = `SELECT
                district,
                withfamily_m + withfamily_f AS lc_category1,
                withspouse_m + withspouse_f AS lc_category2,
                withkids_m + withkids_f AS lc_category3,
                solitudenurse_m + solitudenurse_f AS lc_category4,
                solitude_m + solitude_f AS lc_category5,
                institution_m + institution_f AS lc_category6,
                other_m + other_f AS lc_category7
                FROM living_condition;`
  const res3 = await getSQLAPI(sql3)
  const sql4 = `SELECT
                SUM(withfamily_m) + SUM(withfamily_f) AS lc_category1_sum,
                SUM(withspouse_m) + SUM(withspouse_f) AS lc_category2_sum,
                SUM(withkids_m) + SUM(withkids_f) AS lc_category3_sum,
                SUM(solitudenurse_m) + SUM(solitudenurse_f) AS lc_category4_sum,
                SUM(solitude_m) + SUM(solitude_f) AS lc_category5_sum,
                SUM(institution_m) + SUM(institution_f) AS lc_category6_sum,
                SUM(other_m) + SUM(other_f) AS lc_category7_sum
                FROM living_condition;`
  const res4 = await getSQLAPI(sql4)
  lcResult.value = res3
  lcSumResult.value = res4

  // 准备选择'全市'时的数据
  hcData_sum = Array.from(hcSumResult.value[0]).map(item => Number(item))
  lcData_sum = Array.from(lcSumResult.value[0]).map(item => Number(item))

  updateChart()
}


// 区和下标对应关系
const districtIndex = {
  Huangpu: 0,
  Xuhui: 1,
  Changning: 2,
  Jingan: 3,
  Putuo: 4,
  Hongkou: 5,
  Yangpu: 6,
  Minhang: 7,
  Baoshan: 8,
  Jiading: 9,
  Pudong: 10,
  Jinshan: 11,
  Songjiang: 12,
  Qingpu: 13,
  Fengxian: 14,
  Chongming: 15
}

// 监控当下是哪个饼图
const currentPie = ref(0)
// 监控用于渲染的数据
const hcData = ref(null)
const lcData = ref(null)
const seriesData = ref([])

// 准备两个饼图的legend
const hcLegend = ['健康', '基本健康', '不健康但生活可自理', '不健康且生活不可自理']
const lcLegend = ['与配偶及子女同住', '与配偶同住', '与子女同住', '独居(有保姆)', '独居(无保姆)', '养老机构', '其他']

// 准备颜色
const colorArr = ['#6ab8e0', 'rgb(255, 50, 71)', '#ffa040', '#9e81d3', '#ffe34f', '#4b3d7c', '#7fc8ca']

// update
const updateChart = () => {
  let districtName

  // 根据currentPie的值获取数据
  if (currentPie.value === 0) {  // 0表示健康状况
    if (selectorValue.value !== 'Shanghai') {
      // 各区的情况
      hcData.value = Array.from(hcResult.value[districtIndex[selectorValue.value]])
      districtName = hcData.value.shift()  // 获得当前区中文名称
    } else {
      // 全市的情况
      districtName = '全市'
      hcData.value = hcData_sum
    }
    // 最终放入series的数组
    seriesData.value = hcData.value.map((item, index) => {
      return {
        name: hcLegend[index],
        value: item,
        itemStyle: {
          color: colorArr[index]
        }
      }
    })
  } else if (currentPie.value === 1) {  // 1表示居住状况
    if (selectorValue.value !== 'Shanghai') {
      // 各区的情况
      lcData.value = Array.from(lcResult.value[districtIndex[selectorValue.value]])
      districtName = lcData.value.shift()  // 获得当前区中文名称
    } else {
      // 全市的情况
      districtName = '全市'
      lcData.value = lcData_sum
    }
    // 最终放入series的数组
    seriesData.value = lcData.value.map((item, index) => {
      return {
        name: lcLegend[index],
        value: item,
        itemStyle: {
          color: colorArr[index]
        }
      }
    })
  }


  const dataOption = {
    title: [
      {
        text: `丨${districtName}${currentPie.value === 0 ? '老年人健康状况' : '老年人居住状况'}`
      }
    ],
    legend: {
      data: currentPie.value === 0 ? hcLegend : lcLegend
    },
    series: [
      {
        data: seriesData.value,
      }
    ],
    tooltip: {
      show: true,
      formatter: function (params) {
        let tooltip = `<span style="display: inline-block; margin-right: 0.35vw; border-radius: 50%; width: 1.1vh; height: 1.1vh; background-color: ${params.color};"></span>`
        tooltip += `<span style="color: ${params.color};">${params.name}：</span><span>${params.percent}%</span>`
        // return circle + params.name + ': ' + params.percent + '%'
        return tooltip
      },
    }
  }
  chartInstance.setOption(dataOption)
}


// 自适应
const screenAdapter = () => {
  const titleFontSize = pieRef.value.offsetWidth / 100 * 3.6
  const adaptOption = {
    title: [
      {
        textStyle: {
          fontSize: titleFontSize * 1.2
        }
      }
    ],
    legend: {
      itemWidth: titleFontSize * 0.9,
      itemHeight: titleFontSize * 0.9,
      itemGap: titleFontSize,
      textStyle: {
        fontSize: titleFontSize * 0.9
      }
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


// 所选区发生变化时重新渲染饼图
watch(selectorValue, () => {
  updateChart()
})


const togglePie = () => {
  if (currentPie.value === 1) {
    currentPie.value = 0
  } else {
    currentPie.value = 1
  }
  updateChart()
}




// 表格代码
const tableSQLData = ref([])
// 1. SQL
const getTableData = async () => {
  const sql = `SELECT * FROM oldpop;`
  const res = await getSQLAPI(sql)
  tableSQLData.value = res
}

// 2. 获取渲染表格所需数据
const renderData = ref([])
const finalData = ref([])
const getRenderData = () => {
  if (selectorValue.value === 'Shanghai') {
    renderData.value = tableSQLData.value[0]
  } else {
    renderData.value = tableSQLData.value[districtIndex[selectorValue.value] + 1]
  }
  console.log(renderData.value)
  // 准备符合表格下标的数组
  finalData.value = [`${renderData.value[3]} km²`,
  `${renderData.value[13]} 人`,
  `${Math.floor(renderData.value[2] * 10000)} 人`,
  `${renderData.value[4]} 人/km²`,
  `${renderData.value[5]} 万人`,
  `${renderData.value[7]} 万人`,
  `${renderData.value[9]} 万人`,
  `${renderData.value[11]} 人`,
  `${renderData.value[12]} 人`]
}

// 3. 准备每项要渲染的title
const tableTitle = ['面积', '常住人口数', '户籍人口数', '老年人口密度',
  '60岁及以上老年人口数', '65岁及以上老年人口数', '80岁及以上老年人口数',
  '百岁老人数', '每10万人百岁老人数']

// 4. 准备每项的icon
import Icon from './Icon.vue'
import { Location, Files, MagicStick, User, Star } from '@element-plus/icons-vue'

const iconArr = [Location, Files, Files, MagicStick, User, User, User, Star, Star]

onMounted(async () => {
  await getTableData()
  getRenderData()
})

// 所选区发生变化时重新获得表格中的数据
watch(selectorValue, () => {
  getRenderData()
})

// 5. 添加表格中间dataV装饰
import { Decoration2 } from '@kjgl77/datav-vue3'
</script>

<template>
  <div class="container">
    <!-- 上侧筛选框+表格 -->
    <div class="table">
      <!-- 筛选框 -->
      <div class="select-district">
        <span class="desc">丨各行政区信息查询</span>
        <el-select v-model="selectorValue" class="elp-select" size="large">
          <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.value">
            <span style="
          float: left;
          font-size: 1.4vh;">{{ item.label }}</span>
            <span style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 1.4vh;
          padding-left: 2vh;
        ">{{ item.value }}</span>
          </el-option>
        </el-select>
      </div>

      <!-- 具体信息表格 -->
      <div class="detail-info">
        <!-- v-for遍历 -->
        <div class="detail-box" v-for="(item, index) in tableTitle" :key="index">
          <!-- 左侧icon + label -->
          <div class="left">
            <div class="icon">
              <Icon :Components='iconArr[index]'></Icon>
            </div>
            {{ item }}
          </div>

          <div class="right">{{ finalData[index] }}</div>
        </div>
      </div>
    </div>

    <!-- dataV装饰线 -->
    <div><decoration-2 :reverse="true" :dur="6" class="datav" /></div>

    <!-- 下册饼图 -->
    <div class="pie" ref="pieRef"></div>

    <!-- 左右切换按钮 -->
    <div class="footer-right">
      <!-- <span class="subtitle">数据来源:<br>2020上海市人口普查年鉴</span> -->
      <span class="iconfont arr-left" @click="togglePie">&#xe6ef;</span>
      <span class="iconfont arr-right" @click="togglePie">&#xe6ed;</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.datav {
  position: fixed;
  width: 10vw;
  height: 32.8vh;
  top: 18vh;
  right: 11.3vw;
  z-index: 999;
}

.table {
  width: 25vw;
  height: 39.5vh;
}

.detail-info {
  background-color: rgba(0, 0, 0, 0.25);
  color: rgb(255, 255, 255);
  border-radius: 1vw;
  padding: 0.5vh 0.5vw;
  margin-top: 1vh;

  .detail-box {
    display: flex;
    margin-top: 1.5vh;
    justify-content: space-between;
    text-align: center;

    &:last-child {
      margin-bottom: 1.5vh;
    }

    .left {
      display: flex;
      align-items: center;
      padding-left: 1vw;
      font-size: 1.4vh;

      .icon {
        width: 1.8vh;
        height: 1.8vh;
        margin-right: 0.6vw;
      }
    }

    .right {
      padding-right: 1.6vw;
      font-size: 1.6vh;
    }
  }
}

.pie {
  margin-top: 2vh;
  width: 27vw;
  height: 41vh;
}

/deep/ .el-input__inner {
  font-size: 1.5vh !important;
  font-weight: 500 !important;
}

.select-district {
  .desc {
    display: inline-block;
    width: 10vw;
    font-size: 1.1vw;
    font-family: Microsoft YaHei;
    font-weight: 700;
    margin-right: 2vw;
  }

  .elp-select {
    width: 8vw;
    height: 4vh;
  }
}

.container {
  position: relative;

  .footer-right {
    position: absolute;

    // .subtitle {
    //   position: absolute;
    //   width: 12vw;
    //   font-size: 0.7vw;
    //   top: -2vh;
    //   right: -31vw;
    // }

    .arr-left {
      position: absolute;
      top: -18vh;
      left: 0%;
      font-size: 1.5vw;
      transform: rotate(0deg);
      cursor: pointer;
    }

    .arr-right {
      position: absolute;
      top: -18vh;
      right: -27vw;
      font-size: 1.5vw;
      transform: rotate(0deg);
      cursor: pointer;
    }
  }
}
</style>