import { defineStore } from 'pinia'
import { api } from '../api'
import { useMessagesStore } from './messages'

function errorMessage(err, fallback) {
  return err?.response?.data?.error || fallback
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Basic
    basicAuthHeader: null,
    basicUsername: null,
    basicDashboard: null,

    // Bearer Token
    bearerToken: null,
    bearerUsername: null,
    bearerDashboard: null,

    // JWT
    jwtAccessToken: null,
    jwtRefreshToken: null,
    jwtUsername: null,
    jwtDashboard: null,
  }),

  actions: {
    // ===================== Basic Auth =====================
    async loginBasic(username, password) {
      const messages = useMessagesStore()
      try {
        const { data } = await api.post('/basic/login', { username, password })
        this.basicAuthHeader = `Basic ${data.credentials}`
        this.basicUsername = data.username
        return true
      } catch (err) {
        messages.setError(errorMessage(err, 'Unable to log in with those credentials'))
        return false
      }
    },

    async fetchBasicDashboard() {
      if (!this.basicAuthHeader) return false
      try {
        const { data } = await api.get('/basic/dashboard', {
          headers: { Authorization: this.basicAuthHeader },
        })
        this.basicDashboard = data
        return true
      } catch {
        this.basicDashboard = null
        this.basicAuthHeader = null
        this.basicUsername = null
        return false
      }
    },

    logoutBasic() {
      // Nothing to tell the server
      this.basicAuthHeader = null
      this.basicUsername = null
      this.basicDashboard = null
    },

    // ===================== Bearer Token =====================
    async loginBearer(username, password) {
      const messages = useMessagesStore()
      try {
        const { data } = await api.post('/bearer/login', { username, password })
        this.bearerToken = data.token
        this.bearerUsername = data.username
        return true
      } catch (err) {
        messages.setError(errorMessage(err, 'Unable to log in with those credentials'))
        return false
      }
    },

    async fetchBearerDashboard() {
      if (!this.bearerToken) return false
      try {
        const { data } = await api.get('/bearer/dashboard', {
          headers: { Authorization: `Bearer ${this.bearerToken}` },
        })
        this.bearerDashboard = data
        return true
      } catch {
        this.bearerDashboard = null
        this.bearerToken = null
        this.bearerUsername = null
        return false
      }
    },

    async logoutBearer() {
      if (this.bearerToken) {
        try {
          await api.post(
            '/bearer/logout',
            {},
            { headers: { Authorization: `Bearer ${this.bearerToken}` } },
          )
        } catch {
          // Token might already be invalidated and return an error. Doesn't matter we are still clearing local cache
        }
      }
      this.bearerToken = null
      this.bearerUsername = null
      this.bearerDashboard = null
    },

    // ===================== JWT =====================
    async loginJwt(username, password) {
      const messages = useMessagesStore()
      try {
        const { data } = await api.post('/jwt/login', { username, password })
        this.jwtAccessToken = data.accessToken
        this.jwtRefreshToken = data.refreshToken
        this.jwtUsername = data.username
        return true
      } catch (err) {
        messages.setError(errorMessage(err, 'Unable to log in with those credentials'))
        return false
      }
    },

    async refreshJwt() {
      if (!this.jwtRefreshToken) return false
      try {
        const { data } = await api.post('/jwt/refresh', { refreshToken: this.jwtRefreshToken })
        this.jwtAccessToken = data.accessToken
        return true
      } catch {
        // Refresh token is invalid or expired
        this.jwtAccessToken = null
        this.jwtRefreshToken = null
        this.jwtUsername = null
        return false
      }
    },

    async fetchJwtDashboard() {
      if (!this.jwtAccessToken) return false
      try {
        const { data } = await api.get('/jwt/dashboard', {
          headers: { Authorization: `Bearer ${this.jwtAccessToken}` },
        })
        this.jwtDashboard = data
        return true
      } catch (err) {
        const expired = err?.response?.data?.code === 'TOKEN_EXPIRED'
        if (expired && (await this.refreshJwt())) {
          // Access token expired but the refresh token is still good
          try {
            const { data } = await api.get('/jwt/dashboard', {
              headers: { Authorization: `Bearer ${this.jwtAccessToken}` },
            })
            this.jwtDashboard = data
            return true
          } catch {
            // fail through
          }
        }
        this.jwtDashboard = null
        this.jwtAccessToken = null
        this.jwtRefreshToken = null
        this.jwtUsername = null
        return false
      }
    },

    async logoutJwt() {
      try {
        await api.post('/jwt/logout')
      } catch {
        // Logout is really just discarding token
      }
      this.jwtAccessToken = null
      this.jwtRefreshToken = null
      this.jwtUsername = null
      this.jwtDashboard = null
    },
  },
})
