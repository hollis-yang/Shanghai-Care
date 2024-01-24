<script setup>
import Header from '../Header.vue'
import LayoutAge from './components/LayoutAge.vue'
import LayoutDistrict from './components/LayoutDistrict.vue'
import LayoutExpectLifeA from './components/LayoutExpectLifeA.vue'
import LayoutExpectLifeB from './components/LayoutExpectLifeB.vue'
import LayoutInfo from './components/LayoutInfo.vue'
import LayoutMapA from './components/LayoutMapA.vue'
import LayoutMapB from './components/LayoutMapB.vue'
import LayoutRight from './components/LayoutRight.vue'

import { ref, onMounted, onUnmounted } from 'vue'

const currentExpectLife = ref('A')
// 切换预期寿命的函数
const toggleBarChart = () => {
  if (currentExpectLife.value === 'A') {
    currentExpectLife.value = 'B'
  } else {
    currentExpectLife.value = 'A'
  }
}

const timeIdBar = ref(null)
onMounted(() => {
  timeIdBar.value = setInterval(toggleBarChart, 8000)
})
onUnmounted(() => {
  // 当组件被卸载时清除定时器
  clearInterval(timeIdBar.value)
})

// 监听这个div(.layout-expect-life)的mouseover/mouseout处理定时器
const expectLifeMouseOver = () => {
  clearInterval(timeIdBar.value)
}
const expectLifeMouseOut = () => {
  timeIdBar.value = setInterval(toggleBarChart, 8000)
}


const showMapA = ref(true)
const showMapB = ref(false)
const toggleMap = () => {
  showMapA.value = !showMapA.value
  showMapB.value = !showMapB.value
}
</script>

<template>
  <div class="layout-container">
    <div class="layout-header">
      <Header></Header>
    </div>

    <div class="layout-info">
      <LayoutInfo class="chart"></LayoutInfo>
    </div>

    <div class="layout-age">
      <LayoutAge class="chart"></LayoutAge>
    </div>

    <div class="layout-expect-life">
      <LayoutExpectLifeA class="chart" v-if="currentExpectLife === 'A'" @mouseover="expectLifeMouseOver"
        @mouseout="expectLifeMouseOut">
      </LayoutExpectLifeA>
      <LayoutExpectLifeB class="chart" v-if="currentExpectLife === 'B'" @mouseover="expectLifeMouseOver"
        @mouseout="expectLifeMouseOut">
      </LayoutExpectLifeB>
    </div>

    <div class="layout-map">
      <span class="iconfont arr-left" @click="toggleMap">&#xe6ef;</span>
      <span class="iconfont arr-right" @click="toggleMap">&#xe6ed;</span>
      <LayoutMapA class="chartA fade-in" v-if="showMapA"></LayoutMapA>
      <LayoutMapB class="chartB fade-in" v-if="showMapB"></LayoutMapB>
    </div>

    <div class="layout-district">
      <LayoutDistrict class="chart"></LayoutDistrict>
    </div>

    <div class="layout-table">
      <LayoutRight class="chart"></LayoutRight>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../../assets/css/layout.less';

.arr-left,
.arr-right {
  font-size: 1.5vw;
}
</style>