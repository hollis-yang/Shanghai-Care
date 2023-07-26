<script setup>
import { DataAnalysis, Files } from '@element-plus/icons-vue'
</script>

<template>
  <el-row class="mb-4">
    <el-button color="#2642AA" :dark="isDark"><el-icon><DataAnalysis /></el-icon>&nbsp;护工数据可视化</el-button>
    <span style="width: 1vw;"></span>
    <el-button color="#2642AA" :dark="isDark" plain><el-icon><Files /></el-icon>&nbsp;护理员信息查询</el-button>
  </el-row>
</template>

<style scoped lang="less"></style>