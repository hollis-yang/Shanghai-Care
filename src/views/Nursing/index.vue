<script setup>
import NursingHeader from './components/NursingHeader.vue'
import NursingAge from './components/NursingAge.vue'
import NursingMap from './components/NursingMap.vue'
import NursingDistrict from './components/NursingDistrict.vue'
import ChangeRoute from './components/ChangeRoute.vue'
</script>

<template>
  <div class="nursing-container">
    <div class="nursing-header">
      <NursingHeader></NursingHeader>
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
  </div>
</template>

<style scoped lang="less">
.nursing-container {
  position: relative;
}

.nursing-route {
  position: absolute;
  top: 12vh;
  left: 4vw;
}

.nursing-age {
  position: absolute;
  top: 18vh;
  left: 4vw;

  .chart {
    width: 21vw;
    height: 40vh;
  }
}

.nursing-map {
  position: absolute;
  top: 12vh;
  left: 28vw;

  .chart {
    width: 44vw;
    height: 51vh;
  }
}

.nursing-district {
  position: absolute;
  top: 66vh;
  left: 28vw;
  .chart {
    width: 44vw;
    height: 33vh;
  }
}
</style>