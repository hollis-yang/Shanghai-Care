<script setup>
import Header from '../Header.vue'
import FacilityMap from './components/FacilityMap.vue'
// import FacilityStatistics from './components/FacilityStatistics.vue';
import FacilityQuery from './components/FacilityQuery.vue';
import {ref} from "@vue/runtime-core";

const pois = ref([])
const displayId = ref(0)
const mapMode = ref('normal')
const selectedPoint = ref(null)

const getQueryResults = (results) => {
  pois.value = results.points
  displayId.value = results.idx
}

const passSelectedPoint = (point) => {
  selectedPoint.value = point
}

const changeMapMode = (mode) => {
  mapMode.value = mode
}

</script>

<template>
  <div class="facility-container">
    <div class="facility-header">
      <Header></Header>
    </div>
  </div>
  <div class="facility-map">
<!--    <FacilityStatistics></FacilityStatistics>-->
    <FacilityMap
        :pois=pois
        :display-id="displayId"
        :map-mode="mapMode"
        @passSelectedPoint="passSelectedPoint"></FacilityMap>
    <FacilityQuery
        :selected-point="selectedPoint"
        @passResults="getQueryResults"
        @changeMapMode="changeMapMode"></FacilityQuery>
  </div>

</template>

<style scoped lang="less">
.facility-header {
  width: 100%;
  height: 10vh;
}
.facility-map{
  position: relative;
  height: 86vh;
  max-height: 90vh;
  width: 96vw;
  margin: auto;
  //border: 1px solid;
}
</style>
