<template>
  <div class="d-flex align-items-center justify-content-center" style="min-height: 60vh">
    <div class="card mx-auto" style="max-width: 640px">
      <div class="card-body text-center">
        <h1 class="display-5">404</h1>
        <p class="lead">Sorry, the page you requested was not found.</p>
        <p class="text-muted">
          You will be redirected to the home page in 3 seconds.
          <router-link to="/">Click here</router-link> to go immediately.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let timer

onMounted(() => {
  timer = setTimeout(() => router.push('/'), 3000)
})
onUnmounted(() => clearTimeout(timer))
</script>
