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
  <div class="detail-view">
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
          <button class="edit" @click="startEdit">Bearbeiten</button>
          <button class="delete" @click="remove">Löschen</button>
        </div>
      </template>

      <!-- Bearbeiten-Modus -->
      <template v-else>
        <h2>Post bearbeiten</h2>
        <form @submit.prevent="saveEdit">
          <div class="field">
            <label>Titel</label>
            <input v-model="edit.title" type="text" required />
          </div>
          <div class="field">
            <label>Typ</label>
            <select v-model="edit.type">
              <option value="DOCUMENT">Dokument</option>
              <option value="LINK">Link</option>
            </select>
          </div>
          <div class="field">
            <label>Inhalt</label>
            <textarea v-model="edit.content" rows="4"></textarea>
          </div>
          <div class="field">
            <label>URL</label>
            <input v-model="edit.url" type="text" />
          </div>
          <div class="actions">
            <button class="edit" type="submit" :disabled="saving">
              {{ saving ? 'Speichert…' : 'Speichern' }}
            </button>
            <button class="cancel" type="button" @click="editing = false">Abbrechen</button>
          </div>
        </form>
      </template>

      <RouterLink to="/" class="back">← Zurück zum Feed</RouterLink>
    </div>

    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else>Lade…</p>

    <p v-if="errorMessage && post" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.detail-view {
  background-color: whitesmoke;
  color: black;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  font-family: sans-serif;
}

.post-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
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
  color: #333;
  margin-bottom: 14px;
  white-space: pre-wrap;
}

.preview {
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.preview img {
  max-width: 100%;
  border-radius: 6px;
  margin-bottom: 8px;
}

.preview-title {
  font-weight: bold;
}

.preview-desc {
  color: #555;
  font-size: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.field label {
  font-weight: bold;
  margin-bottom: 6px;
}

.field input,
.field select,
.field textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: white;
}

.edit {
  background-color: #2c3e50;
}

.edit:hover:not(:disabled) {
  background-color: #1a252f;
}

.delete {
  background-color: #c0392b;
}

.delete:hover {
  background-color: #a33125;
}

.cancel {
  background-color: #888;
}

.cancel:hover {
  background-color: #6f6f6f;
}

.back {
  display: block;
  margin-top: 20px;
  color: #2c3e50;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}

.error {
  color: red;
}
</style>
