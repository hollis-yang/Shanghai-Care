<script setup>
const labels = document.querySelectorAll('.form-control label')

labels.forEach(label => {
  // innerHtml带标签; innerText仅文字
  label.innerHTML = label.innerText
    .split('')
    .map((letter, idx) => `<span style="transition-delay:${idx * 50}ms">${letter}</span>`)  // 每个字母动画的延迟
    .join('')
})
</script>

<template>
  <div id="app">
    <div class="container">
      <h1>上海市智慧养老系统</h1>
      <form>
        <div class="form-control">
          <!-- 必填项 required -->
          <input type="text" required>
          <label>
            <span v-for="(item, index) in '用户名 / Username'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <div class="form-control">
          <!-- 必填项 required -->
          <input type="password" required>
          <label>
            <span v-for="(item, index) in '密码 / Password'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <button class="btn">登录</button>
      </form>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../assets/css/login.less';
</style>