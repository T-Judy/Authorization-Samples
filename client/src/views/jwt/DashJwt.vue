<template>
  <div v-if="dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">JWT Dashboard</h2>
        <p class="text-muted mb-0">Logged in as <strong>{{ dashboard.username }}</strong></p>
      </div>
      <button class="btn btn-outline-secondary" @click="logout">Logout</button>
    </div>

    <div class="row g-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-primary text-white">Access Token</div>
          <div class="card-body">
            <p class="small text-muted">
              This signed token is sent on every request. It has three base64url parts separated
              by dots:
            </p>
            <code class="d-block bg-light p-3 rounded" style="word-break: break-all; font-size: 0.8rem">
              {{ dashboard.accessToken }}
            </code>
            <hr />
            <p class="small text-muted mb-1">Full authorization header:</p>
            <code class="d-block bg-light p-3 rounded" style="word-break: break-all; font-size: 0.8rem">
              {{ dashboard.header }}
            </code>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">Decoded Payload</div>
          <div class="card-body">
            <pre class="bg-light p-3 rounded small mb-0">{{ payloadJson }}</pre>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">Token Lifetimes</div>
          <div class="card-body">
            <table class="table table-sm mb-0">
              <tbody>
                <tr>
                  <td class="text-muted">Access token expires</td>
                  <td><span class="badge bg-warning text-dark">15 minutes</span></td>
                </tr>
                <tr>
                  <td class="text-muted">Refresh token expires</td>
                  <td><span class="badge bg-success">7 days</span></td>
                </tr>
                <tr>
                  <td class="text-muted">exp (Unix timestamp)</td>
                  <td><code>{{ dashboard.exp }}</code> <span class="text-muted">({{ expFormatted }})</span></td>
                </tr>
                <tr>
                  <td class="text-muted">iat (Unix timestamp)</td>
                  <td><code>{{ dashboard.iat }}</code> <span class="text-muted">({{ iatFormatted }})</span></td>
                </tr>
                <tr>
                  <td class="text-muted">Minutes remaining</td>
                  <td><code>{{ minutesRemaining }}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header">Security Properties</div>
          <div class="card-body">
            <table class="table table-sm mb-0">
              <tbody>
                <tr>
                  <td class="text-muted">Credentials exposed</td>
                  <td><span class="badge bg-success">Login only</span></td>
                </tr>
                <tr>
                  <td class="text-muted">Server-side storage</td>
                  <td><span class="badge bg-success">None</span></td>
                </tr>
                <tr>
                  <td class="text-muted">Access token expiry</td>
                  <td><span class="badge bg-success">15 minutes</span></td>
                </tr>
                <tr>
                  <td class="text-muted">Revocation</td>
                  <td><span class="badge bg-danger">Hard; needs a blacklist</span></td>
                </tr>
                <tr>
                  <td class="text-muted">Lookups per request</td>
                  <td><span class="badge bg-success">None</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <div class="card-header">How This Worked</div>
          <div class="card-body small text-muted">
            <ol class="mb-0">
              <li>You submitted the login form and the Express server checked your credentials</li>
              <li>
                It signed a header <code>{"alg":"HS256","typ":"JWT"}</code> and a payload with your user id, 
                <code>iat</code>, and <code>exp</code> using
                <code>jsonwebtoken.sign()</code> and a secret kept in <code>server/.env</code>
              </li>
              <li>The access token and refresh token came back in the login response</li>
              <li>
                Loading this dashboard sent <code>{{ dashboard.header }}</code>; the server's
                <code>jwtAuth</code> middleware re-computed the signature with
                <code>jsonwebtoken.verify()</code> to confirm nothing was tampered with
              </li>
              <li>When the access token expires, the refresh token is exchanged for a new one at <code>/api/jwt/refresh</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>

  <p v-else class="text-muted small">Verifying token with the server…</p>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const dashboard = computed(() => auth.jwtDashboard)

function formatUnix(ts) {
  return new Date(ts * 1000).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC')
}

const payloadJson = computed(() => (dashboard.value ? JSON.stringify(dashboard.value.payload, null, 2) : ''))
const expFormatted = computed(() => (dashboard.value ? formatUnix(dashboard.value.exp) : ''))
const iatFormatted = computed(() => (dashboard.value ? formatUnix(dashboard.value.iat) : ''))
const minutesRemaining = computed(() =>
  dashboard.value ? Math.max(0, Math.floor((dashboard.value.exp - Date.now() / 1000) / 60)) : 0,
)

onMounted(async () => {
  const ok = await auth.fetchJwtDashboard()
  if (!ok) router.push({ name: 'login_jwt' })
})

async function logout() {
  await auth.logoutJwt()
  router.push({ name: 'login_jwt' })
}
</script>
