<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import logoUrl from './components/icons/logo_noB.png'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="brand">
      <img :src="logoUrl" alt="StudyHub Logo" class="logo" />
      <span class="brand-name">StudyHub</span>
    </RouterLink>

    <nav class="nav-links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/posts/new">Post erstellen</RouterLink>

      <template v-if="auth.isLoggedIn">
        <span class="user">Hallo, {{ auth.username }}</span>
        <button class="btn btn-primary" @click="logout">Logout</button>
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
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--primary-tint);
  margin-bottom: 2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.brand:hover {
  text-decoration: none;
}
.logo {
  height: 48px;
  width: auto;
}
.brand-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}
.nav-links a {
  color: var(--text);
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
}
.nav-links a:hover,
.nav-links a.router-link-active {
  background: var(--primary-tint);
  color: var(--primary);
  text-decoration: none;
}
.user {
  color: var(--muted);
  font-size: 0.9rem;
}

/* Responsive: auf schmalen Bildschirmen alles zentriert untereinander */
@media (max-width: 600px) {
  .navbar {
    justify-content: center;
    text-align: center;
  }
  .nav-links {
    justify-content: center;
  }
}
</style>
