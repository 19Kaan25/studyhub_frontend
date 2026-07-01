<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import http from '../api/http'
import { useAuthStore } from '../stores/auth'
import type { Post, PostType } from '../types/post'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const post = ref<Post | null>(null)
const errorMessage = ref('')
const editing = ref(false)
const saving = ref(false)

const edit = ref<{ title: string; content: string; url: string; type: PostType }>({
  title: '',
  content: '',
  url: '',
  type: 'DOCUMENT',
})

const isOwner = computed(
  () => post.value !== null && auth.userId !== null && post.value.userId === auth.userId,
)

onMounted(async () => {
  try {
    const response = await http.get<Post>(`/api/posts/${route.params.id}`)
    post.value = response.data
  } catch {
    errorMessage.value = `Post mit ID ${route.params.id} nicht gefunden.`
  }
})

function startEdit() {
  if (!post.value) return
  edit.value = {
    title: post.value.title,
    content: post.value.content ?? '',
    url: post.value.url ?? '',
    type: post.value.type,
  }
  editing.value = true
}

async function saveEdit() {
  if (!post.value) return
  saving.value = true
  errorMessage.value = ''
  try {
    const response = await http.put<Post>(`/api/posts/${post.value.id}`, edit.value)
    post.value = response.data
    editing.value = false
  } catch {
    errorMessage.value = 'Speichern fehlgeschlagen.'
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!post.value) return
  if (!confirm('Diesen Post wirklich löschen?')) return
  try {
    await http.delete(`/api/posts/${post.value.id}`)
    await router.push('/')
  } catch {
    errorMessage.value = 'Löschen fehlgeschlagen.'
  }
}
</script>

<template>
  <div class="detail card">
    <div v-if="post">
      <!-- Anzeige-Modus -->
      <template v-if="!editing">
        <div class="post-head">
          <h2>{{ post.title }}</h2>
          <span class="badge" :class="post.type === 'LINK' ? 'badge-link' : 'badge-doc'">
            {{ post.type === 'LINK' ? 'Link' : 'Dokument' }}
          </span>
        </div>

        <p v-if="post.content" class="content">{{ post.content }}</p>

        <p v-if="post.url">
          <strong>URL:</strong>
          <a :href="post.url" target="_blank" rel="noopener">{{ post.url }}</a>
        </p>

        <div v-if="post.previewImageUrl || post.previewTitle" class="preview">
          <img v-if="post.previewImageUrl" :src="post.previewImageUrl" alt="Vorschaubild" />
          <p v-if="post.previewTitle" class="preview-title">{{ post.previewTitle }}</p>
          <p v-if="post.previewDescription" class="preview-desc">{{ post.previewDescription }}</p>
        </div>

        <div v-if="isOwner" class="actions">
          <button class="btn btn-primary" @click="startEdit">Bearbeiten</button>
          <button class="btn btn-danger" @click="remove">Löschen</button>
        </div>
      </template>

      <!-- Bearbeiten-Modus -->
      <template v-else>
        <h2>Post bearbeiten</h2>
        <form @submit.prevent="saveEdit">
          <div class="field">
            <label>Titel</label>
            <input class="input" v-model="edit.title" type="text" required />
          </div>
          <div class="field">
            <label>Typ</label>
            <select class="input" v-model="edit.type">
              <option value="DOCUMENT">Dokument</option>
              <option value="LINK">Link</option>
            </select>
          </div>
          <div class="field">
            <label>Inhalt</label>
            <textarea class="input" v-model="edit.content" rows="4"></textarea>
          </div>
          <div class="field">
            <label>URL</label>
            <input class="input" v-model="edit.url" type="text" />
          </div>
          <div class="actions">
            <button class="btn btn-primary" type="submit" :disabled="saving">
              {{ saving ? 'Speichert…' : 'Speichern' }}
            </button>
            <button class="btn btn-ghost" type="button" @click="editing = false">Abbrechen</button>
          </div>
        </form>
      </template>

      <p v-if="errorMessage" class="error msg">{{ errorMessage }}</p>
      <RouterLink to="/" class="back">← Zurück zum Feed</RouterLink>
    </div>

    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else class="loading">Lade…</p>
  </div>
</template>

<style scoped>
.detail {
  max-width: 600px;
  margin: 2rem auto;
}
.post-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.content {
  color: var(--text);
  margin-bottom: 1rem;
  white-space: pre-wrap;
}
.preview {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
}
.preview img {
  max-width: 100%;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
.preview-title {
  font-weight: 700;
}
.preview-desc {
  color: var(--muted);
  font-size: 0.9rem;
}
.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.2rem;
}
.msg {
  margin-top: 1rem;
}
.back {
  display: inline-block;
  margin-top: 1.2rem;
  font-weight: 500;
}
.loading {
  color: var(--muted);
}
</style>
