// axios基础封装
import axios from "axios"

const httpInstance = axios.create({
  baseURL: 'http://47.103.58.142:8787/',
  timeout: 5000
})


// 拦截器

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  return config
}, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
  return Promise.reject(e)
})


export default httpInstance