<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { API_BASE_URL } from '../api/http'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import FavoriteButton from './FavoriteButton.vue'
import type { Post } from '../types/post'

const props = defineProps<{ post: Post }>()

const auth = useAuthStore()
const favorites = useFavoritesStore()

const favorited = computed(() => favorites.isFavorite(props.post.id))

async function toggleFavorite() {
  try {
    await favorites.toggle(props.post.id)
  } catch {
    // Fehler beim Favorisieren ignorieren wir hier bewusst (kein blockierender Ablauf).
  }
}
</script>

<template>
  <li class="card post">
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
      <a v-if="post.fileName" :href="`${API_BASE_URL}/api/posts/${post.id}/file`" class="post-link">
        📄 {{ post.fileName }} herunterladen
      </a>
    </div>

    <!-- Stern nur für eingeloggte Nutzer -->
    <FavoriteButton
      v-if="auth.isLoggedIn"
      class="post-fav"
      :favorited="favorited"
      @toggle="toggleFavorite"
    />
  </li>
</template>

<style scoped>
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
  padding-right: 3.5rem; /* Platz für Badge oben rechts */
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

/* Badge oben rechts in der Ecke */
.post .badge {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
}

/* Stern unten rechts */
.post-fav {
  position: absolute;
  bottom: 0.9rem;
  right: 1rem;
}

/* Mobil: Bild oben, Text darunter */
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
  .post-fav {
    position: static;
    align-self: flex-end;
  }
}
</style>
