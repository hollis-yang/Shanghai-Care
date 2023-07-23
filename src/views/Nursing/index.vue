<script setup>
import NursingHeader from './Components/NursingHeader.vue'
import NursingAge from './components/NursingAge.vue'
</script>

<template>
  <div class="nursing-container">
    <div class="nursing-header">
      <NursingHeader></NursingHeader>
    </div>

    <div class="nursing-age">
      <NursingAge class="chart"></NursingAge>
    </div>
  </div>
</template>

<style scoped lang="less">
.nursing-container {
  position: relative;
}

.nursing-age {
  position: absolute;
  background-color: red;
  top: 8vw;
  left: 8vh;

  .chart {
    width: 20vw;
    height: 42vh;
  }
}
</style>