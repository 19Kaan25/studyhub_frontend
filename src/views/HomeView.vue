<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '../api/http'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import PostCard from '../components/PostCard.vue'
import type { Post } from '../types/post'

const posts = ref<Post[]>([])
const errorMessage = ref('')

const auth = useAuthStore()
const favorites = useFavoritesStore()

onMounted(async () => {
  try {
    const response = await http.get<Post[]>('/api/posts')
    posts.value = response.data.slice().reverse()
    // Für eingeloggte Nutzer die Favoriten laden, damit die Sterne stimmen.
    if (auth.isLoggedIn && !favorites.loaded) {
      await favorites.load()
    }
  } catch {
    errorMessage.value = 'Posts konnten nicht geladen werden.'
  }
})
</script>

<template>
  <div class="feed">
    <h2 class="feed-title">Zuletzt erstellte Posts</h2>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <ul v-if="posts.length > 0" class="post-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </ul>

    <p v-else-if="!errorMessage" class="empty">Noch keine Posts vorhanden.</p>
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

.empty {
  text-align: center;
  color: var(--muted);
  margin-top: 2rem;
}
</style>
