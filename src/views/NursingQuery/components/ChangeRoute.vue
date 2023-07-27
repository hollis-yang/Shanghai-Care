<script setup>
import { DataAnalysis, Files } from '@element-plus/icons-vue'
</script>

<template>
  <el-row class="mb-4">
    <router-link :to="{ path: '/nursing' }">
      <el-button color="#2642AA" plain>
        <el-icon>
          <DataAnalysis />
        </el-icon>
        &nbsp;护工数据可视化
      </el-button>
    </router-link>

    <span style="width: 1vw;"></span>

    <el-button color="#2642AA">
      <el-icon>
        <Files />
      </el-icon>
      &nbsp;护理员信息查询
    </el-button>
  </el-row>
</template>

<style scoped lang="less"></style>