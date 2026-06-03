<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/" class="title-link">
      <h1>StudyHub - HTW Berlin</h1>
    </RouterLink>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/resources">Ressource erstellen</RouterLink>
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
</style>
