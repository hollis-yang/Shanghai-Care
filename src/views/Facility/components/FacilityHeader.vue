<script setup>
import { ref, onMounted } from 'vue'

// 展示当前时间
const currentTime = ref('')
function updateCurrentTime() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateCurrentTime()
  // 定时器
  setInterval(() => {
    updateCurrentTime()
  }, 1000);
})
</script>

<template>
  <!-- title -->
  <div class="title">上 海 市 智 慧 养 老 系 统</div>

  <div class="header-container">
    <!-- 左侧 -->
    <div class="left">
      <!-- 主页概述 -->
      <div class="left-item">
        <img src="../../../assets/img/bnt.png" alt="概述">
        <span class="desc">主 页 概 述</span>
      </div>
      <!-- 养老设施页 -->
      <div class="left-item active">
        <img src="../../../assets/img/bntactive.png" alt="养老设施">
        <span class="desc">养 老 设 施</span>
      </div>
      <!-- 护工信息页 -->
      <div class="left-item">
        <img src="../../../assets/img/bnt.png" alt="护理员信息">
        <span class="desc">护 工 信 息</span>
      </div>
    </div>

    <!-- 用于flex布局占位 -->
    <div class="middle"></div>

    <!-- 右侧 -->
    <div class="right">
      <!-- 社区活动页 -->
      <div class="right-item active">
        <img src="../../../assets/img/bnt.png" alt="概述">
        <span class="desc">社 区 活 动</span>
      </div>
      <!-- 健康档案页 -->
      <div class="right-item">
        <img src="../../../assets/img/bnt.png" alt="养老设施">
        <span class="desc">健 康 档 案</span>
      </div>
      <!-- 最右侧时间 -->
      <div class="right-item datetime">
        <div class="desc">{{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.header-container {
  display: flex;
}

.title {
  position: fixed;
  left: 50%;
  top: 2%;
  transform: translateX(-50%);
  font-size: 3vh;
  font-weight: 700;
}

.left {
  flex: 0.4;
  display: flex;
  justify-content: space-around;
  margin-top: 5vh;
  margin-left: 4vw;

  .left-item {
    position: relative;
    display: inline-block;
    width: 8vw;
    cursor: pointer;

    img {
      width: 6vw;
      height: 4vh;
    }
  }
}

.middle {
  flex: 0.6;
}

.right {
  flex: 0.4;
  display: flex;
  justify-content: space-around;
  margin-top: 5vh;
  margin-right: 2vw;

  .right-item {
    position: relative;
    display: inline-block;
    width: 8vw;
    cursor: pointer;

    img {
      width: 6vw;
      height: 4vh;
    }
  }
}

.desc {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8vw;
  padding-bottom: 0.5vh;
  margin-left: -1vw;
}

.right-item.datetime {
  text-align: center;
  cursor: default;
}
</style>