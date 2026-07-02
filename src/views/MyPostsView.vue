<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import http, { API_BASE_URL } from '../api/http'
import type { Post } from '../types/post'

const posts = ref<Post[]>([])
const errorMessage = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    // /api/posts/mine liefert nur die Posts des eingeloggten Users (neueste zuerst).
    const response = await http.get<Post[]>('/api/posts/mine')
    posts.value = response.data
  } catch {
    errorMessage.value = 'Deine Posts konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="my-posts">
    <h2 class="feed-title">Meine Posts</h2>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <ul v-if="posts.length > 0" class="post-list">
      <li v-for="post in posts" :key="post.id" class="card post">
        <span class="badge" :class="post.type === 'LINK' ? 'badge-link' : 'badge-doc'">
          {{ post.type === 'LINK' ? 'Link' : 'Dokument' }}
        </span>

        <a
          v-if="post.previewImageUrl"
          :href="post.url || undefined"
          target="_blank"
          rel="noopener"
          class="post-thumb"
        >
          <img :src="post.previewImageUrl" alt="Vorschaubild" />
        </a>

        <div class="post-body">
          <RouterLink :to="`/posts/${post.id}`" class="post-title">{{ post.title }}</RouterLink>
          <p v-if="post.content" class="post-content">{{ post.content }}</p>
          <a v-if="post.url" :href="post.url" target="_blank" rel="noopener" class="post-link">
            Zur Ressource ↗
          </a>
          <a
            v-if="post.fileName"
            :href="`${API_BASE_URL}/api/posts/${post.id}/file`"
            class="post-link"
          >
            📄 {{ post.fileName }} herunterladen
          </a>
        </div>
      </li>
    </ul>

    <div v-else-if="!loading && !errorMessage" class="empty">
      <p>Du hast noch keine Posts erstellt.</p>
      <RouterLink to="/posts/new" class="btn btn-primary">Ersten Post erstellen</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.feed-title {
  text-align: center;
  color: var(--primary);
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
}
.feed-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  margin: 0.6rem auto 0;
  border-radius: 2px;
  background: var(--primary);
  opacity: 0.35;
}

.post-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.post {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.post:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}
.post-thumb {
  flex: none;
  width: 220px;
  display: block;
}
.post-thumb img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}
.post-body {
  flex: 1;
  min-width: 0;
  padding-right: 3.5rem;
}
.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  display: inline-block;
}
.post-content {
  color: var(--muted);
  margin: 0.5rem 0 1rem;
}
.post-link {
  display: inline-block;
  font-weight: 600;
  margin-right: 1rem;
}
.post .badge {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
}
.empty {
  text-align: center;
  color: var(--muted);
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 600px) {
  .post {
    flex-direction: column;
    align-items: stretch;
  }
  .post-thumb {
    width: 100%;
  }
  .post-thumb img {
    height: 180px;
  }
  .post-body {
    padding-right: 0;
  }
  .post .badge {
    position: static;
    align-self: flex-start;
    margin-bottom: 0.5rem;
  }
}
</style>
