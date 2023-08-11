import { defineStore } from 'pinia'

export const useNameStore = defineStore('name', {
  state: () => ({
    userName: ''
  }),
  actions: {
    setUserName(value) {
      this.userName = value
    }
  }
})
