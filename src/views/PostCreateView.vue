<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import http from '../api/http'
import type { Post, PostType } from '../types/post'

const router = useRouter()

interface PostForm {
  title: string
  content: string
  url: string
  type: PostType
  previewTitle: string
  previewDescription: string
  previewImageUrl: string
}

const form = ref<PostForm>({
  title: '',
  content: '',
  url: '',
  type: 'DOCUMENT',
  previewTitle: '',
  previewDescription: '',
  previewImageUrl: '',
})

const previewLoading = ref(false)
const errorMessage = ref('')
const submitting = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

const hasPreview = computed(
  () => !!(form.value.previewTitle || form.value.previewDescription || form.value.previewImageUrl),
)

// Wenn URL oder Typ sich ändern: Vorschau neu laden – aber erst 600ms nach der letzten Eingabe.
watch(
  () => [form.value.url, form.value.type],
  () => {
    clearPreview()
    if (debounceTimer) clearTimeout(debounceTimer)

    // Vorschau nur bei Typ "Link" und wenn eine URL da ist
    if (form.value.type !== 'LINK' || !form.value.url.trim()) return

    previewLoading.value = true
    debounceTimer = setTimeout(fetchPreview, 600)
  },
)

function clearPreview() {
  form.value.previewTitle = ''
  form.value.previewDescription = ''
  form.value.previewImageUrl = ''
  previewLoading.value = false
}

async function fetchPreview() {
  try {
    const response = await http.get('/api/link-preview', { params: { url: form.value.url } })
    const data = response.data
    if (data && (data.title || data.description || data.imageUrl)) {
      form.value.previewTitle = data.title ?? ''
      form.value.previewDescription = data.description ?? ''
      form.value.previewImageUrl = data.imageUrl ?? ''
      // Titel vorbefüllen, wenn der Nutzer noch keinen eingegeben hat
      if (!form.value.title && data.title) {
        form.value.title = data.title
      }
    }
  } catch {
    // Vorschau bleibt leer – kein Fehler nach außen
  } finally {
    previewLoading.value = false
  }
}

async function createPost() {
  errorMessage.value = ''
  submitting.value = true
  try {
    const response = await http.post<Post>('/api/posts', form.value)
    await router.push(`/posts/${response.data.id}`)
  } catch {
    errorMessage.value = 'Fehler beim Erstellen des Posts.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="create card">
    <h2>Neuen Post erstellen</h2>

    <form @submit.prevent="createPost">
      <div class="field">
        <label>Titel</label>
        <input
          class="input"
          v-model="form.title"
          type="text"
          required
          placeholder="z.B. Spring Boot Tutorial"
        />
      </div>

      <div class="field">
        <label>Typ</label>
        <select class="input" v-model="form.type">
          <option value="DOCUMENT">Dokument</option>
          <option value="LINK">Link</option>
        </select>
      </div>

      <div class="field">
        <label>Inhalt</label>
        <textarea
          class="input"
          v-model="form.content"
          rows="4"
          placeholder="Beschreibung / Inhalt"
        ></textarea>
      </div>

      <div class="field">
        <label>URL</label>
        <input class="input" v-model="form.url" type="text" placeholder="https://..." />
      </div>

      <!-- Link-Vorschau (nur bei Typ "Link") -->
      <div v-if="form.type === 'LINK'" class="preview-area">
        <p v-if="previewLoading" class="preview-loading">Vorschau wird geladen…</p>
        <div v-else-if="hasPreview" class="preview-card">
          <img v-if="form.previewImageUrl" :src="form.previewImageUrl" alt="Vorschaubild" />
          <div class="preview-text">
            <p v-if="form.previewTitle" class="preview-title">{{ form.previewTitle }}</p>
            <p v-if="form.previewDescription" class="preview-desc">{{ form.previewDescription }}</p>
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-full" type="submit" :disabled="submitting">
        {{ submitting ? 'Wird erstellt…' : 'Erstellen' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error msg">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.create {
  max-width: 500px;
  margin: 2rem auto;
}
h2 {
  margin-bottom: 1.5rem;
}
.msg {
  margin-top: 1rem;
}

/* --- Link-Vorschau --- */
.preview-area {
  margin-bottom: 1rem;
}
.preview-loading {
  color: var(--muted);
  font-size: 0.9rem;
}
.preview-card {
  display: flex;
  gap: 0.8rem;
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
}
.preview-card img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  flex: none;
}
.preview-title {
  font-weight: 700;
  font-size: 0.95rem;
}
.preview-desc {
  color: var(--muted);
  font-size: 0.85rem;
  margin-top: 0.2rem;
}
</style>
