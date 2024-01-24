<script setup>
import { ref } from 'vue'

const isRegister = ref(false)  // 初始为登录界面

function changePage() {
  isRegister.value = !isRegister.value
  username.value = ''
  password1.value = ''
  password2.value = ''
}

// v-model双向绑定获取用户填写的数据
const username = ref('')
const password1 = ref('')
const password2 = ref('')

// 登录与注册
import { getSQLAPI } from '@/apis/mysql'
import { insertSQLAPI } from '@/apis/insertsql'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 用pinia管理是否是admin
import { useAdminStore } from '@/stores/admin'
const isAdmin = ref(null)  // 1表示是admin
const adminStore = useAdminStore()

// 用pinia管理当前登录的用户名
import { useNameStore } from '@/stores/username'
const nameStore = useNameStore()

const checkResult = ref(null)  // 1表示信息正确

const checkLoginData = async () => {
  const sql = `
    SELECT COUNT(*), SUM(isadmin)
    FROM user_accounts
    WHERE password = '${password1.value}' AND username = '${username.value}';`
  const res = await getSQLAPI(sql)

  checkResult.value = res[0][0]
  isAdmin.value = Number(res[0][1])

  console.log(typeof isAdmin.value)
  adminStore.setIsAdmin(isAdmin.value)
}


const warningText = ref('')
const checkRegister = async () => {
  // 1. 两次密码不一致
  if (password1.value !== password2.value) {
    warningText.value = '两次密码不一致！请重新输入！'
    clickWarning()
    return false
  }

  // 2. 用户名已被注册
  const sql = `SELECT COUNT(*) FROM user_accounts WHERE username = '${username.value}';`
  const res = await getSQLAPI(sql)

  if (res[0][0] === 1) {
    warningText.value = '用户名已被注册！'
    clickWarning()
    return false
  }
  return true
}


const successText = ref('')
const submitForm = async () => {
  // 如果是登录的情况
  if (!isRegister.value) {
    await checkLoginData()
    if (checkResult.value) {
      // 用户名密码填写正确时
      successText.value = '登录成功！'
      clickSuccess()
      // 跳转路由到主页
      router.push('/screen')
      // 把用户名存入pinia
      nameStore.setUserName(username.value)
      // 清空数据
      username.value = ''
      password1.value = ''
    } else {
      // 用户名密码错误
      clickError()
    }
  } else {
    // 如果是注册的情况

    // 检查注册内容是否符合要求
    let check = await checkRegister()

    if (check) {
      // 添加数据到数据库
      const insertCode = `INSERT INTO user_accounts VALUES ('${username.value}', '${password1.value}', 0);`
      insertSQLAPI(insertCode)
        .then(() => {
          successText.value = '注册成功！'
          clickSuccess()
        })

      // 切换回登录
      isRegister.value = false
      // 清空数据
      username.value = ''
      password1.value = ''
      password2.value = ''
    }
  }
}


const clickSuccess = () => {
  ElMessage({
    showClose: false,
    message: successText.value,
    type: 'success'
  })
}

const clickError = () => {
  ElMessage({
    showClose: false,
    message: '用户名不存在或密码错误！',
    type: 'error'
  })
}

const clickWarning = () => {
  ElMessage({
    showClose: false,
    message: warningText.value,
    type: 'warning'
  })
}

</script>

<template>
  <div id="app">
    <div class="container">
      <h1>上海市智慧养老系统</h1>
      <form @submit.prevent="submitForm">
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

        <button class="btn login" v-show="!isRegister" type="submit">登录</button>
        <button class="btn register" v-show="isRegister" type="submit">注册</button>

        <div class="change">
          <p v-show="!isRegister" @click="changePage">没有账号？前往注册</p>
        </div>
        <div class="change">
          <p v-show="isRegister" @click="changePage">已有账号？前往登录</p>
        </div>

      </form>
    </div>
    <el-button :plain="true" @click="clickSuccess" class="elbtn"></el-button>
    <el-button :plain="true" @click="clickError" class="elbtn"></el-button>
    <el-button :plain="true" @click="clickWarning" class="elbtn"></el-button>
  </div>
</template>

<style lang="less" scoped>
@import '../../assets/css/login.less';
</style>