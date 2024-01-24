<script setup>
import Header from '../Header.vue'
import NursingAge from './components/NursingAge.vue'
import NursingMap from './components/NursingMap.vue'
import NursingDistrict from './components/NursingDistrict.vue'
import NursingEducation from './components/NursingEducation.vue'
import NursingLicense from './components/NursingLicense.vue'
import NursingWork from './components/NursingWork.vue'
import ChangeRoute from './components/ChangeRoute.vue'
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
</script>

<template>
  <div class="nursing-container">
    <div class="nursing-header">
      <Header></Header>
    </div>

    <div class="nursing-route">
      <ChangeRoute></ChangeRoute>
    </div>

    <div class="nursing-age">
      <NursingAge class="chart"></NursingAge>
    </div>

    <div class="nursing-map">
      <NursingMap class="chart"></NursingMap>
    </div>

    <div class="nursing-district">
      <NursingDistrict class="chart"></NursingDistrict>
    </div>

    <div class="nursing-education">
      <NursingEducation class="chart"></NursingEducation>
    </div>

    <div class="nursing-license">
      <NursingLicense class="chart"></NursingLicense>
    </div>

    <div class="nursing-work">
      <NursingWork class="chart"></NursingWork>
    </div>

    <div class="map-title-border">
      <div demo-bg class="dataV">
        <dv-border-box8 :reverse="true">
          <div dv-bg>
            <div class="desc">上海市各区护理员人数</div>
          </div>
        </dv-border-box8>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../../assets/css/nursing.less';
</style>