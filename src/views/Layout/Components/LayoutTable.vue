<script setup>
import { ref } from 'vue'
import { districtOptions } from '@/utils/district'

const selectorValue = ref('Option0')


</script>

<template>
  <div class="select-district">
    <span class="desc">丨各行政区信息查询</span>
    <el-select v-model="selectorValue" class="m-2 elp-select" size="large">
      <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<style lang="less" scoped>
.select-district {
  .desc {
    display: inline-block;
    width: 10vw;
    font-size: 1.1vw;
    font-family: Microsoft YaHei;
    font-weight: 700;
    margin-right: 2vw;
  }
  .elp-select {
    width: 12vw;
    height: 4.3vh;
  }
}
</style>