<script setup lang="ts">
import type { Comment } from '../types/comment'

defineProps<{
  comments: Comment[]
  currentUserId: number | null
}>()
const emit = defineEmits<{ delete: [id: number] }>()

// Zeitstempel kompakt auf Deutsch darstellen.
function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
</script>

<template>
  <div class="comments">
    <p v-if="comments.length === 0" class="empty">Noch keine Kommentare.</p>

    <ul v-else class="comment-list">
      <li v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-head">
          <span class="author">{{ comment.authorUsername }}</span>
          <span class="date">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="comment-text">{{ comment.content }}</p>
        <button
          v-if="currentUserId !== null && comment.userId === currentUserId"
          type="button"
          class="delete"
          @click="emit('delete', comment.id)"
        >
          Löschen
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.comment-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.comment {
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
}
.comment-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.35rem;
}
.author {
  font-weight: 700;
  color: var(--primary);
}
.date {
  font-size: 0.8rem;
  color: var(--muted);
}
.comment-text {
  margin: 0;
  white-space: pre-wrap;
}
.delete {
  margin-top: 0.5rem;
  background: transparent;
  border: none;
  color: var(--danger, #c0392b);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.delete:hover {
  text-decoration: underline;
}
.empty {
  color: var(--muted);
}
</style>
