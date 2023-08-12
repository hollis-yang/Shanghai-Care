import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isadmin: null
  }),
  actions: {
    setIsAdmin(value) {
      this.isadmin = value
    }
  }
})
