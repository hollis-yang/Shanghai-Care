<script setup>
import Header from '../Header.vue'
import InformationInquiry from './components/InformationInquiry.vue'
import Detail from './components/detail.vue'
</script>

<template>
  <div class="health-container">
    <div class="health-header">
      <Header></Header>
    </div>
    <div class="nursing-route">
      <InformationInquiry></InformationInquiry>
    </div>
    <div class="nursing-right">
      <Detail></Detail>
    </div>
  </div>
</template>

<style scoped lang="less">
.health-header {
  width: 100%;
  height: 10vh;
}
.nursing-right {
  position: absolute;
  right: 10%;
  width: 620px;
  height: 553px;
  top: 14vh;
}
.nursing-route {
  position: absolute;
  top: 12vh;
  left: 4vw;
}
</style>