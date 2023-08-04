<script setup>
import { ref } from 'vue'
import { districtOptions } from '@/utils/district'

const selectorValue = ref('Shanghai')


</script>

<template>
  <div class="table">
    <div class="select-district">
      <span class="desc">丨各行政区信息查询</span>
      <el-select v-model="selectorValue" class="elp-select">
        <el-option v-for="item in districtOptions" :key="item.value" :label="item.label" :value="item.value">
          <span style="
        float: left;
        font-size: 1.3vh;">{{ item.label }}</span>
          <span style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 1.3vh;
          padding-left: 2vh;
        ">{{ item.value }}</span>
        </el-option>
      </el-select>
    </div>
  </div>
  <div class="pie"></div>
</template>

<style lang="less" scoped>
.table {
  width: 27vw;
  height: 41vh;
  background-color: red;
}
.pie
{
  margin-top: 1vh;
  width: 27vw;
  height: 40vh;
  background-color: blue;
}
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
    width: 8vw;
    height: 3.2vh;
  }
}
</style>