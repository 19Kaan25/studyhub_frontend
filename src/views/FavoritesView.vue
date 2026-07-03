<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import PostCard from '../components/PostCard.vue'
import type { Post } from '../types/post'

const favorites = useFavoritesStore()

const posts = ref<Post[]>([])
const errorMessage = ref('')
const loading = ref(true)

// Nur die Posts anzeigen, die aktuell noch favorisiert sind. Entfernt der User den
// Stern auf dieser Seite, verschwindet die Karte dadurch sofort.
const visiblePosts = computed(() => posts.value.filter((post) => favorites.isFavorite(post.id)))

onMounted(async () => {
  try {
    posts.value = await favorites.load()
  } catch {
    errorMessage.value = 'Deine Favoriten konnten nicht geladen werden.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="favorites">
    <h2 class="feed-title">Meine Favoriten</h2>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <ul v-if="visiblePosts.length > 0" class="post-list">
      <PostCard v-for="post in visiblePosts" :key="post.id" :post="post" />
    </ul>

    <div v-else-if="!loading && !errorMessage" class="empty">
      <p>Du hast noch keine Posts favorisiert.</p>
      <RouterLink to="/" class="btn btn-primary">Zum Feed</RouterLink>
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
.empty {
  text-align: center;
  color: var(--muted);
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
