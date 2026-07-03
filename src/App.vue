<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useFavoritesStore } from './stores/favorites'
import logoUrl from './components/icons/logo_noB.png'

const auth = useAuthStore()
const favorites = useFavoritesStore()
const router = useRouter()

function logout() {
  auth.logout()
  favorites.reset()
  router.push('/login')
}
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="brand">
      <img :src="logoUrl" alt="StudyHub Logo" class="logo" />
      <span class="brand-name">StudyHub</span>
    </RouterLink>

    <nav class="nav-pills">
      <RouterLink to="/" class="nav-pill">
        <svg
          class="ic"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h5v-6h4v6h5V10" />
        </svg>
        Home
      </RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/posts/new" class="nav-pill">
        <svg
          class="ic"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
        Post erstellen
      </RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/my-posts" class="nav-pill">
        <svg
          class="ic"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        Meine Posts
      </RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/favorites" class="nav-pill">
        <svg
          class="ic"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
        Favoriten
      </RouterLink>
    </nav>

    <div class="nav-right">
      <template v-if="auth.isLoggedIn">
        <span class="user-name">
          <svg
            class="ic"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
          </svg>
          Hallo, {{ auth.username }}
        </span>
        <button class="logout-btn" @click="logout">
          <svg
            class="ic"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Logout
        </button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="nav-pill light">Login</RouterLink>
        <RouterLink to="/register" class="nav-pill light">Registrieren</RouterLink>
      </template>
    </div>
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
  gap: 0.75rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  padding: 0.6rem 1rem;
  border-radius: 16px;
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow);
}

/* Marke links */
.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand:hover {
  text-decoration: none;
}
.logo {
  height: 34px;
  width: auto;
  /* dunkles Logo auf dunkler Navbar -> per Filter weiß färben */
  filter: brightness(0) invert(1);
}
.brand-name {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
}

/* Segmentierte Navigation (Mitte) */
.nav-pills {
  display: flex;
  gap: 0.2rem;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.2rem;
  border-radius: 11px;
  margin-left: auto;
}
.nav-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.42rem 0.7rem;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  font-size: 0.88rem;
  white-space: nowrap;
}
.nav-pill:hover {
  background: rgba(255, 255, 255, 0.14);
  text-decoration: none;
}
.nav-pill.router-link-exact-active {
  background: #fff;
  color: var(--primary);
}
.nav-pill.light {
  background: rgba(255, 255, 255, 0.12);
}

.nav-pill.light.router-link-exact-active {
  background: #fff;
  color: var(--primary);
}

/* Nutzerbereich rechts */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: auto;
}
.user-name {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #fff;
  font-weight: 600;
  font-size: 0.88rem;
  white-space: nowrap;
}
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.42rem 0.8rem;
  border-radius: 9px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  white-space: nowrap;
}
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.ic {
  width: 17px;
  height: 17px;
}

/* Nur auf schmalen Bildschirmen alles zentriert stapeln */
@media (max-width: 720px) {
  .navbar {
    justify-content: center;
  }
  /* Auto-Ränder aufheben, damit die Elemente hier wirklich zentriert werden. */
  .nav-pills,
  .nav-right {
    margin-left: 0;
  }
}
</style>
