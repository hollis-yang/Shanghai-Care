<script setup>
import NursingHeader from '../Nursing/components/NursingHeader.vue'
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
</style>