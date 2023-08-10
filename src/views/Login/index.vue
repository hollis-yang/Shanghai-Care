<script setup>
import { ref } from 'vue'

const isRegister = ref(false)
</script>

<template>
  <div id="app">
    <div class="container">
      <h1>上海市智慧养老系统</h1>
      <form>
        <div class="form-control">
          <!-- 必填项 required -->
          <input type="text" required class="text">
          <label>
            <span v-for="(item, index) in '用户名 / Username'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <div class="form-control">
          <!-- 必填项 required -->
          <input type="password" required class="text">
          <label>
            <span v-for="(item, index) in '密码 / Password'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <div class="form-control" v-if="isRegister">
          <!-- 必填项 required -->
          <input type="password" required class="text">
          <label>
            <span v-for="(item, index) in '再次输入密码 / Password'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <button class="btn login" v-show="!isRegister">登录</button>
        <button class="btn register" v-show="isRegister">注册</button>
      </form>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../assets/css/login.less';
</style>