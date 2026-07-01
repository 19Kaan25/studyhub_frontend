<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import http from '../api/http'
import type { Post } from '../types/post'

const posts = ref<Post[]>([])
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await http.get<Post[]>('/api/posts')
    posts.value = response.data.slice().reverse()
  } catch {
    errorMessage.value = 'Posts konnten nicht geladen werden.'
  }
})
</script>

<template>
  <div class="home-view">
    <h2>Zuletzt erstellte Posts</h2>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <ul v-if="posts.length > 0">
      <li v-for="post in posts" :key="post.id">
        <div class="post-head">
          <RouterLink :to="`/posts/${post.id}`" class="post-title">{{ post.title }}</RouterLink>
          <span class="badge" :class="post.type === 'LINK' ? 'badge-link' : 'badge-doc'">
            {{ post.type === 'LINK' ? 'Link' : 'Dokument' }}
          </span>
        </div>
        <p v-if="post.content" class="content">{{ post.content }}</p>
        <a v-if="post.url" :href="post.url" target="_blank" rel="noopener">Zur Ressource ↗</a>
      </li>
    </ul>

    <p v-else-if="!errorMessage">Noch keine Posts vorhanden.</p>
  </div>
</template>

<style scoped>
/*.home-view {
  background-color: whitesmoke;
  color: black;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  font-family: sans-serif;
}

h2 {
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #ddd;
}

.post-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-title {
  font-weight: bold;
  font-size: 16px;
  color: #2c3e50;
  text-decoration: none;
}

.post-title:hover {
  text-decoration: underline;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
}

.badge-doc {
  background-color: #e0e7ff;
  color: #3730a3;
}

.badge-link {
  background-color: #dcfce7;
  color: #166534;
}

.content {
  color: #555;
  font-size: 14px;
  margin: 6px 0;
}

a {
  color: #2c3e50;
  font-size: 14px;
}

.error {
  color: red;
}
*/

/* --- Layout --- */
.home-view {
  max-width: 800px; /* Etwas breiter für das Card-Layout */
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
}

/* --- Listen-Design --- */
ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Abstand zwischen den Posts */
}

/* Aus jedem <li> wird eine schicke Karte */
li {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

li:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
}

/* --- Card Header --- */
.post-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  text-decoration: none;
  line-height: 1.3;
}

.post-title:hover {
  color: #2563eb;
}

/* --- Badges --- */
.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;
}

.badge-doc {
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.badge-link {
  background-color: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

/* --- Content --- */
.content {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* --- Der "Zur Ressource" Link am Ende der Karte --- */
li > a {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
  width: 100%; /* Trennstrich über die volle Breite */
  transition: color 0.2s ease;
}

li > a:hover {
  color: #1d4ed8;
}

/* --- Fehlermeldung --- */
.error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}
</style> */
