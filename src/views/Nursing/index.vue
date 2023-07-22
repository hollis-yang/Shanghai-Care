<script setup>
import NursingHeader from './Components/NursingHeader.vue'
import chartexample from './components/chartexample.vue'
</script>

<template>
  <div class="nursing-container">
    <div class="nursing-header">
      <NursingHeader class="nursing-header"></NursingHeader>
    </div>

    <div class="coat">
      <chartexample class="chart"></chartexample>
    </div>
  </div>
</template>

<style scoped lang="less">
.nursing-container {
  position: relative;
}

.coat {
  background-color: red;
  position: absolute;
  top: 12vh;
  left: 3vw;

  .chart {
    height: 40vh;
    width: 30vw;
  }
}
</style>