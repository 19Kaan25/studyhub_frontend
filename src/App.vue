<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <header>
    <RouterLink to="/" class="title-link">
      <h1>StudyHub - HTW Berlin</h1>
    </RouterLink>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/posts/new">Post erstellen</RouterLink>

      <template v-if="auth.isLoggedIn">
        <span class="user">Hallo, {{ auth.username }}</span>
        <button class="logout" @click="logout">Logout</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Registrieren</RouterLink>
      </template>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-family: sans-serif;
}

.title-link {
  text-decoration: none;
  color: inherit;
}

.title-link:hover h1 {
  opacity: 0.8;
}

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 12px;
}

nav a {
  text-decoration: none;
  color: #2c3e50;
  font-size: 15px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

nav a:hover,
nav a.router-link-active {
  background-color: #e0e0e0;
}

.user {
  font-size: 14px;
  color: #555;
}

.logout {
  padding: 6px 14px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.logout:hover {
  background-color: #1a252f;
}
</style>
