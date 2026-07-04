<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import http, { API_BASE_URL } from '../api/http'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'
import FavoriteButton from '../components/FavoriteButton.vue'
import type { Post, PostType } from '../types/post'
import type { Comment } from '../types/comment'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const favorites = useFavoritesStore()

const post = ref<Post | null>(null)
const errorMessage = ref('')
const editing = ref(false)
const saving = ref(false)

const comments = ref<Comment[]>([])
const favorited = computed(() => (post.value ? favorites.isFavorite(post.value.id) : false))

const edit = ref<{
  title: string
  content: string
  url: string
  type: PostType
  previewTitle: string
  previewDescription: string
  previewImageUrl: string
}>({
  title: '',
  content: '',
  url: '',
  type: 'DOCUMENT',
  previewTitle: '',
  previewDescription: '',
  previewImageUrl: '',
})

const previewLoading = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

const hasEditPreview = computed(
  () => !!(edit.value.previewTitle || edit.value.previewDescription || edit.value.previewImageUrl),
)

const isOwner = computed(
  () => post.value !== null && auth.userId !== null && post.value.userId === auth.userId,
)

// Download-Link zur angehängten Datei (öffentlich abrufbar). Content-Disposition
// im Backend sorgt dafür, dass die Datei heruntergeladen statt geöffnet wird.
const downloadUrl = computed(() =>
  post.value ? `${API_BASE_URL}/api/posts/${post.value.id}/file` : '',
)

onMounted(async () => {
  try {
    const response = await http.get<Post>(`/api/posts/${route.params.id}`)
    post.value = response.data
    await loadComments()
    // Favoriten laden, damit der Stern den richtigen Zustand zeigt.
    if (auth.isLoggedIn && !favorites.loaded) {
      await favorites.load()
    }
  } catch {
    errorMessage.value = `Post mit ID ${route.params.id} nicht gefunden.`
  }
})

async function loadComments() {
  if (!post.value) return
  const response = await http.get<Comment[]>(`/api/posts/${post.value.id}/comments`)
  comments.value = response.data
}

async function addComment(content: string) {
  if (!post.value) return
  try {
    await http.post(`/api/posts/${post.value.id}/comments`, { content })
    await loadComments()
  } catch {
    errorMessage.value = 'Kommentar konnte nicht gespeichert werden.'
  }
}

async function deleteComment(commentId: number) {
  if (!post.value) return
  try {
    await http.delete(`/api/posts/${post.value.id}/comments/${commentId}`)
    comments.value = comments.value.filter((comment) => comment.id !== commentId)
  } catch {
    errorMessage.value = 'Kommentar konnte nicht gelöscht werden.'
  }
}

async function toggleFavorite() {
  if (!post.value) return
  try {
    await favorites.toggle(post.value.id)
  } catch {
    errorMessage.value = 'Favorit konnte nicht geändert werden.'
  }
}

function startEdit() {
  if (!post.value) return
  edit.value = {
    title: post.value.title,
    content: post.value.content ?? '',
    url: post.value.url ?? '',
    type: post.value.type,
    // Vorschau-Felder mit übernehmen, damit sie beim Speichern erhalten bleiben.
    previewTitle: post.value.previewTitle ?? '',
    previewDescription: post.value.previewDescription ?? '',
    previewImageUrl: post.value.previewImageUrl ?? '',
  }
  editing.value = true
}

// Wird nur bei echter Nutzereingabe aufgerufen (nicht beim Befüllen in startEdit),
// damit eine vorhandene Vorschau nicht ungewollt verschwindet.
function onPreviewInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  clearEditPreview()
  // Bei "Dokument" gibt es kein URL-Feld -> eine evtl. vorhandene URL verwerfen
  if (edit.value.type !== 'LINK') {
    edit.value.url = ''
    return
  }
  if (!edit.value.url.trim()) return
  previewLoading.value = true
  debounceTimer = setTimeout(fetchEditPreview, 600)
}

function clearEditPreview() {
  edit.value.previewTitle = ''
  edit.value.previewDescription = ''
  edit.value.previewImageUrl = ''
  previewLoading.value = false
}

async function fetchEditPreview() {
  try {
    const response = await http.get('/api/link-preview', { params: { url: edit.value.url } })
    const data = response.data
    if (data && (data.title || data.description || data.imageUrl)) {
      edit.value.previewTitle = data.title ?? ''
      edit.value.previewDescription = data.description ?? ''
      edit.value.previewImageUrl = data.imageUrl ?? ''
    }
  } catch {
    // Vorschau bleibt leer
  } finally {
    previewLoading.value = false
  }
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
          <FavoriteButton
            v-if="auth.isLoggedIn"
            class="head-fav"
            :favorited="favorited"
            @toggle="toggleFavorite"
          />
        </div>

        <p v-if="post.content" class="content">{{ post.content }}</p>

        <p v-if="post.url">
          <strong>URL:</strong>
          <a :href="post.url" target="_blank" rel="noopener">{{ post.url }}</a>
        </p>

        <div v-if="post.previewImageUrl || post.previewTitle" class="preview">
          <a
            v-if="post.previewImageUrl"
            :href="post.url || undefined"
            target="_blank"
            rel="noopener"
          >
            <img :src="post.previewImageUrl" alt="Vorschaubild" />
          </a>
          <p v-if="post.previewTitle" class="preview-title">{{ post.previewTitle }}</p>
          <p v-if="post.previewDescription" class="preview-desc">{{ post.previewDescription }}</p>
        </div>

        <p v-if="post.fileName" class="file-download">
          <a :href="downloadUrl" class="btn btn-primary"> 📄 {{ post.fileName }} herunterladen </a>
        </p>

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
            <input class="input" v-model="edit.title" type="text" required maxlength="200" />
          </div>
          <div class="field">
            <label>Typ</label>
            <select class="input" v-model="edit.type" @change="onPreviewInput">
              <option value="DOCUMENT">Dokument</option>
              <option value="LINK">Link</option>
            </select>
          </div>
          <div class="field">
            <label>Inhalt</label>
            <textarea class="input" v-model="edit.content" rows="4" maxlength="5000"></textarea>
          </div>
          <div v-if="edit.type === 'LINK'" class="field">
            <label>URL</label>
            <input class="input" v-model="edit.url" type="text" @input="onPreviewInput" />
          </div>

          <!-- Link-Vorschau (nur bei Typ "Link") -->
          <div v-if="edit.type === 'LINK'" class="preview">
            <p v-if="previewLoading" class="preview-loading">Vorschau wird geladen…</p>
            <template v-else-if="hasEditPreview">
              <img v-if="edit.previewImageUrl" :src="edit.previewImageUrl" alt="Vorschaubild" />
              <p v-if="edit.previewTitle" class="preview-title">{{ edit.previewTitle }}</p>
              <p v-if="edit.previewDescription" class="preview-desc">
                {{ edit.previewDescription }}
              </p>
            </template>
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

      <!-- Kommentare (nur im Anzeige-Modus) -->
      <section v-if="!editing" class="comment-section">
        <h3 class="comment-heading">Kommentare</h3>
        <CommentForm v-if="auth.isLoggedIn" @submit="addComment" />
        <p v-else class="hint">
          <RouterLink to="/login">Melde dich an</RouterLink>, um zu kommentieren.
        </p>
        <CommentList :comments="comments" :current-user-id="auth.userId" @delete="deleteComment" />
      </section>

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
.head-fav {
  margin-left: auto;
}
.comment-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.comment-heading {
  color: var(--primary);
  margin-bottom: 1rem;
}
.hint {
  color: var(--muted);
  margin-bottom: 1.5rem;
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
.preview-loading {
  color: var(--muted);
  font-size: 0.9rem;
}
.file-download {
  margin-top: 1rem;
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
