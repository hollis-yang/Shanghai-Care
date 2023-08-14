<script setup>
import Header from '../Header.vue'
import ChangeRoute from './components/ChangeRoute.vue'
import InformationInquiry from './components/InformationInquiry.vue'
import Detail from './components/detail.vue'
</script>

<template>
  <div class="nursing-container">
    <div class="nursing-header">
      <Header></Header>
    </div>

    <div class="nursing-route">
      <ChangeRoute></ChangeRoute>
        <InformationInquiry></InformationInquiry>
    </div>
    <div class="nursing-right">
      <Detail></Detail>
    </div>
  </div>
</template>

<style scoped lang="less">
.nursing-container {
  position: relative;
}
.nursing-right {
  position: absolute;
  right: 10%;
  width: calc(60vw - 10%);
  top: 18vh;
}
.nursing-route {
  position: absolute;
  top: 12vh;
  left: 4vw;
}
</style>