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
  const infoHealthObj = ref({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    child_phone: '',
    medical_history: '',
    allergy: '',
    elevator: '',
    district: '',
    diet: '',
    solitude: '',
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
  // 触发更新
  const setUpdate = () => {
    update.value = !update.value
  }
  // 修改数据
  const setInfoObj = (obj) => {
    infoObj.value = obj
  }
  const setInfoHealthObj = (obj) => {
    infoHealthObj.value = obj;
  }
  // 在组件挂载时开始定时器
  setInterval(() => {
    updateTime()
  }, 1000)

  return {
    currentTime,
    infoObj,
    setInfoObj,
    update,
    setUpdate,
    infoHealthObj,
    setInfoHealthObj
  }
})