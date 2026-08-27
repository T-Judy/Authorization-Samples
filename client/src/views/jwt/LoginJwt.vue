<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <h2 class="mb-1">JWT Login</h2>
      <p class="text-muted mb-4">Login once to receive a signed access token and a refresh token.</p>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" type="text" class="form-control" autofocus required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Signing in…' : 'Login & Get JWT' }}
            </button>
          </form>
          <p class="small text-muted mt-3 mb-0">Demo account: <code>demo</code> / <code>demo123</code></p>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-header">What happens when you submit</div>
        <div class="card-body small text-muted">
          <ol class="mb-0">
            <li>The Express server checks the username and password against its user table</li>
            <li>
              On success, it signs a token pair with <code>jsonwebtoken</code> using a secret
              that never leaves the server
            </li>
            <li>Nothing is written to a database</li>
            <li>The access token (15 min) and refresh token (7 days) come back in the response and are saved to the auth store</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useMessagesStore } from '../../stores/messages'

const username = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()
const messages = useMessagesStore()

async function submit() {
  messages.clear()
  loading.value = true
  const ok = await auth.loginJwt(username.value, password.value)
  loading.value = false
  if (ok) {
    router.push({ name: 'dash_jwt' })
  }
}
</script>
