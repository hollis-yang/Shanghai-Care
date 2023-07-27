<script setup>
import { DataAnalysis, Files } from '@element-plus/icons-vue'
</script>

<template>
  <el-row class="mb-4">
    <el-button color="#2642AA" style="width: 9vw;">
      <el-icon><DataAnalysis /></el-icon>
      &nbsp;护工数据可视化
    </el-button>

    <span style="width: 1vw;"></span>
    
    <router-link :to="{ path: '/nursing/query' }">
      <el-button color="#2642AA" plain style="width: 9vw;">
        <el-icon><Files /></el-icon>
        &nbsp;护理员信息查询
      </el-button>
    </router-link>

  </el-row>
</template>

<style scoped lang="less"></style>