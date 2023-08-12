<script setup>
import { useTime } from '@/stores/time'
// 使用pinia管理时间
const time = useTime()
</script>

<template>
  <!-- title -->
  <div class="title">上 海 市 智 慧 养 老 系 统</div>

  <div class="header-container">
    <!-- 左侧 -->
    <div class="left">

      <!-- 主页概述 -->
      <RouterLink to="/screen">
        <div class="left-item">
          <img src="../../../assets/img/bnt.png" alt="概述">
          <span class="desc">主 页 概 述</span>
        </div>
      </RouterLink>

      <!-- 养老设施页 -->
      <RouterLink to="/facility">
        <div class="left-item">
          <img src="../../../assets/img/bnt.png" alt="养老设施">
          <span class="desc">养 老 设 施</span>
        </div>
      </RouterLink>

      <!-- 护工信息页 -->
      <RouterLink to="/nursing">
        <div class="left-item">
          <img src="../../../assets/img/bnt.png" alt="护理员信息">
          <span class="desc">护 工 信 息</span>
        </div>
      </RouterLink>
    </div>

    <!-- 用于flex布局占位 -->
    <div class="middle"></div>

    <!-- 右侧 -->
    <div class="right">

      <!-- 社区活动页 -->
      <RouterLink to="/activity">
        <div class="right-item active">
          <img src="../../../assets/img/bntactive.png" alt="概述">
          <span class="desc">社 区 活 动</span>
        </div>
      </RouterLink>

      <!-- 健康档案页 -->
      <RouterLink to="/health">
        <div class="right-item">
          <img src="../../../assets/img/bnt.png" alt="养老设施">
          <span class="desc">健 康 档 案</span>
        </div>
      </RouterLink>
      <!-- 最右侧时间 -->
      <div class="right-item datetime">
        <div class="desc">{{ time.currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../../../assets/css/header.less';
</style>