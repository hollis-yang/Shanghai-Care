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

  <div>
    <FacilityMap></FacilityMap>
  </div>

</template>

<style scoped lang="less">
.facility-header {
  width: 100%;
  height: 10vh;
}
</style>