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
.home-view {
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
</style>
