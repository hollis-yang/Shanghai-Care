import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTime = defineStore('time', () => {
  const currentTime = ref('')
  // 初始化数据
  const infoObj = ref({
    name: '',
    gender: '',
    age: '',
    residence: '',
    organization: '',
    certificate: '',
    comprehensive: '',
    honor: '',
    competition: '',
    id: '',
  })
  // 更新变量
  const update = ref(false);
  const updateTime = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // 在组件挂载时开始定时器
  setInterval(() => {
    updateTime()
  }, 1000)

  return {
    currentTime,
  }
})
