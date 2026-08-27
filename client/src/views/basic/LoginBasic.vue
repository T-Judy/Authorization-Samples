<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <h2 class="mb-1">Basic Auth Login</h2>
      <p class="text-muted mb-4">Your credentials will be base64-encoded and sent on every request.</p>

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
            <button type="submit" class="btn btn-danger w-100">Login</button>
          </form>
          <p class="small text-muted mt-3 mb-0">Demo account: <code>demo</code> / <code>demo123</code></p>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-header">What happens when you submit</div>
        <div class="card-body small text-muted">
          <ol class="mb-0">
            <li>The Express server's <code>getUserByCredentials()</code> checks the username and password</li>
            <li>The browser keeps the raw username and password in memory</li>
            <li>Every future request attaches: <code>Authorization: Basic &lt;encoded&gt;</code>, re-checked server-side every time</li>
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
const router = useRouter()
const auth = useAuthStore()
const messages = useMessagesStore()

async function submit() {
  messages.clear()
  const ok = await auth.loginBasic(username.value, password.value)
  if (ok) {
    router.push({ name: 'dash_basic' })
  }
}
</script>
