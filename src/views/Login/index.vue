<script setup>
import { ref } from 'vue'

const isRegister = ref(false)

function changePage() {
  isRegister.value = !isRegister.value
}

// v-model双向绑定获取用户填写的数据
const username = ref('')
const password1 = ref('')
const password2 = ref('')

// 登录验证
import { getSQLAPI } from '@/apis/mysql'
import { useRouter } from 'vue-router'

const isAdmin = ref(null)

const checkResult = ref([])
const checkLoginData = async () => {
  const sql = `
    SELECT *
    FROM admin_accounts
    WHERE password = ${password1.value} AND account = ${username.value};`
  const res = await getSQLAPI(sql)
  checkResult.value = res
  console.log(res)
}
checkLoginData()
</script>

<template>
  <div id="app">
    <div class="container">
      <h1>上海市智慧养老系统</h1>
      <form>
        <div class="form-control">
          <!-- 必填项 required -->
          <input type="text" required class="text" v-model="username">
          <label>
            <span v-for="(item, index) in '用户名 / Username'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <div class="form-control">
          <!-- 必填项 required -->
          <input type="password" required class="text" v-model="password1">
          <label>
            <span v-for="(item, index) in '密码 / Password'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <div class="form-control" v-if="isRegister">
          <!-- 必填项 required -->
          <input type="password" required class="text" v-model="password2">
          <label>
            <span v-for="(item, index) in '再次输入密码 / Password'" :key="index" :style="`transition-delay:${index * 30}ms`">
              {{ item }}</span>
          </label>
        </div>

        <button class="btn login" v-show="!isRegister">登录</button>
        <button class="btn register" v-show="isRegister">注册</button>

        <div class="change">
          <p v-show="!isRegister" @click="changePage">没有账号？前往注册</p>
        </div>
        <div class="change">
          <p v-show="isRegister" @click="changePage">已有账号？前往登录</p>
        </div>

      </form>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../../assets/css/login.less';
</style>