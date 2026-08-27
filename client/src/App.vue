<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container">
      <router-link to="/" class="navbar-brand">Vue Auth Demo</router-link>
      <div class="navbar-nav flex-row gap-3">
        <router-link to="/basic/login" class="nav-link">Basic</router-link>
        <router-link to="/bearer/login" class="nav-link">Bearer</router-link>
        <router-link to="/jwt/login" class="nav-link">JWT</router-link>
      </div>
    </div>
  </nav>

  <main class="container pb-5">
    <div v-if="messages.error" class="alert alert-danger alert-dismissible" role="alert">
      {{ messages.error }}
      <button type="button" class="btn-close" @click="messages.clear()"></button>
    </div>
    <div v-if="messages.info" class="alert alert-info alert-dismissible" role="alert">
      {{ messages.info }}
      <button type="button" class="btn-close" @click="messages.clear()"></button>
    </div>

    <router-view />
  </main>
</template>

<script setup>
import { useMessagesStore } from './stores/messages'

const messages = useMessagesStore()
</script>
