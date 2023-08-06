<script setup>
import FacilityHeader from './components/FacilityHeader.vue'
import FacilityMap from './components/FacilityMap.vue';
</script>

<template>
  <div class="facility-container">
    <div class="facility-header">
      <FacilityHeader></FacilityHeader>
    </div>
  </div>
  <div class="facility-map">
    <FacilityMap></FacilityMap>
  </div>

</template>

<style scoped lang="less">
.facility-header {
  width: 100%;
  height: 10vh;
}
.facility-map{
  height: 90vh;
  max-height: 90vh;
}
</style>
