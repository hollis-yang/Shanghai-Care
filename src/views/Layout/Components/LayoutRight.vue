<script setup>
// 筛选框+表格代码
import { districtOptions } from '@/utils/district'
import { onMounted, ref, onUnmounted, watch } from 'vue'

const selectorValue = ref('Xuhui')  // 当前筛选框选中了哪个区
// const selectDistrictCN = ref(selectorValue.value)




// echarts 代码
import * as echarts from 'echarts'
import { getSQLAPI } from '@/apis/mysql'

// init
const pieRef = ref(null)
let chartInstance
const initChart = () => {
  chartInstance = echarts.init(pieRef.value, 'dark')

  // 图表初始化配置
  const initOption = {}
  chartInstance.setOption(initOption)
}

// SQL
const hcResult = ref([])
const hcSumResult = ref([])
const lcResult = ref([])
const lcSumResult = ref([])
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

  console.log('1', res1)
  console.log('2', res2)
  console.log('3', res3)
  console.log('4', res4)
  updateChart()
}


// update
const updateChart = () => {
  console.log('update执行')
  const dataOption = {}
  chartInstance.setOption(dataOption)
}


// 自适应
const screenAdapter = () => {
  const adaptOption = {}
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
watch(selectorValue, (newValue, oldValue) => {
  console.log('new:', newValue)
  console.log('old:', oldValue)
  updateChart()
})
</script>

<template>
  <!-- 上侧筛选框+表格 -->
  <div class="table">
    <div class="select-district">
      <span class="desc">丨各行政区信息查询</span>
      <el-select v-model="selectorValue" class="elp-select">
        <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.value">
          <span style="
          float: left;
          font-size: 1.3vh;">{{ item.label }}</span>
          <span style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 1.3vh;
          padding-left: 2vh;
        ">{{ item.value }}</span>
        </el-option>
      </el-select>
    </div>
  </div>

  <!-- 下册饼图 -->
  <div class="pie" ref="pieRef"></div>
</template>

<style lang="less" scoped>
.table {
  width: 27vw;
  height: 41vh;
  // background-color: red;
}

.pie {
  margin-top: 1vh;
  width: 27vw;
  height: 40vh;
  background-color: skyblue;
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
    height: 3.2vh;
  }
}
</style>