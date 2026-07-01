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
  <div class="feed">
    <h2>Zuletzt erstellte Posts</h2>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <ul v-if="posts.length > 0" class="post-list">
      <li v-for="post in posts" :key="post.id" class="card post">
        <div class="post-head">
          <RouterLink :to="`/posts/${post.id}`" class="post-title">{{ post.title }}</RouterLink>
          <span class="badge" :class="post.type === 'LINK' ? 'badge-link' : 'badge-doc'">
            {{ post.type === 'LINK' ? 'Link' : 'Dokument' }}
          </span>
        </div>
        <p v-if="post.content" class="post-content">{{ post.content }}</p>
        <a
          v-if="post.previewImageUrl"
          :href="post.url || undefined"
          target="_blank"
          rel="noopener"
          class="feed-preview-link"
        >
          <img :src="post.previewImageUrl" alt="Vorschaubild" class="feed-preview" />
        </a>
        <a v-if="post.url" :href="post.url" target="_blank" rel="noopener" class="post-link">
          Zur Ressource ↗
        </a>
      </li>
    </ul>

    <p v-else-if="!errorMessage" class="empty">Noch keine Posts vorhanden.</p>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
}
.post-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.post {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.post:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}
.post-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.6rem;
}
.post-title {
  font-size: 1.2rem;
  font-weight: 700;
}
.post-content {
  color: var(--muted);
  margin-bottom: 0.8rem;
}
.feed-preview-link {
  display: block;
  margin-bottom: 0.8rem;
}
.feed-preview {
  display: block;
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
.post-link {
  display: inline-block;
  font-weight: 600;
}
.empty {
  text-align: center;
  color: var(--muted);
  margin-top: 2rem;
}
</style>
