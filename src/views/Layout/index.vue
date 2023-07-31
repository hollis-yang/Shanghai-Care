<script setup>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutAge from './components/LayoutAge.vue'
import LayoutDistrict from './components/LayoutDistrict.vue'
import LayoutExpectLife from './components/LayoutExpectLife.vue'
import LayoutInfo from './components/LayoutInfo.vue'
import LayoutMap from './components/LayoutMap.vue'
import LayoutPie from './components/LayoutPie.vue'
import LayoutTable from './components/LayoutTable.vue'
</script>

<template>
  <div class="layout-container">
    <div class="layout-header">
      <LayoutHeader class="chart"></LayoutHeader>
    </div>

    <div class="layout-info">
      <LayoutInfo class="chart"></LayoutInfo>
    </div>

    <div class="layout-age">
      <LayoutAge class="chart"></LayoutAge>
    </div>

    <div class="layout-expect-life">
      <LayoutExpectLife class="chart"></LayoutExpectLife>
    </div>

    <div class="layout-map">
      <LayoutMap class="chart"></LayoutMap>
    </div>

    <div class="layout-district">
      <LayoutDistrict class="chart"></LayoutDistrict>
    </div>

    <div class="layout-table">
      <LayoutTable class="chart"></LayoutTable>
    </div>

    <div class="layout-pie">
      <LayoutPie class="chart"></LayoutPie>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../../assets/css/layout.less';
</style>