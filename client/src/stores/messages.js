import { defineStore } from 'pinia'

// Shared store for flash-style error/info messages can surface API errors
export const useMessagesStore = defineStore('messages', {
  state: () => ({
    error: null,
    info: null,
  }),

  actions: {
    setError(message) {
      this.error = message
      this.info = null
    },

    setInfo(message) {
      this.info = message
      this.error = null
    },
    
    clear() {
      this.error = null
      this.info = null
    },
  },
})
