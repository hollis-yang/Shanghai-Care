<script setup>
import { DataAnalysis, Files } from '@element-plus/icons-vue'
</script>

<template>
  <el-row class="mb-4">
    <router-link :to="{ path: '/nursing' }">
      <el-button color="#2642AA" class="el-button" plain>
        <span class="icon"><el-icon>
            <DataAnalysis />
          </el-icon></span>
        <span class="desc">&nbsp;护工数据可视化</span>
      </el-button>
    </router-link>

    <span style="width: 1vw;"></span>

    <el-button color="#2642AA" class="el-button">
      <span class="icon"><el-icon>
          <Files />
        </el-icon></span>
      <span class="desc">&nbsp;护理员信息查询</span>
    </el-button>

  </el-row>
</template>

<style scoped lang="less">
.el-button {
  width: 9vw;
  height: 4vh;

  .desc,
  .icon {
    font-size: 0.85vw;
  }
}
</style>