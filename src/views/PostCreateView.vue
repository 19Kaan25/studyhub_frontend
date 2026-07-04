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

// --- Datei-Upload (nur bei Typ "Dokument") ---
const selectedFile = ref<File | null>(null)
const fileError = ref('')
const ERLAUBTE_TYPEN = ['application/pdf', 'image/png', 'image/jpeg']
const MAX_GROESSE = 5 * 1024 * 1024 // 5 MB

function onFileChange(event: Event) {
  fileError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  if (file) {
    if (!ERLAUBTE_TYPEN.includes(file.type)) {
      fileError.value = 'Nur PDF, PNG oder JPG erlaubt.'
      selectedFile.value = null
      input.value = ''
      return
    }
    if (file.size > MAX_GROESSE) {
      fileError.value = 'Datei zu groß (max. 5 MB).'
      selectedFile.value = null
      input.value = ''
      return
    }
  }
  selectedFile.value = file
}

const hasPreview = computed(
  () => !!(form.value.previewTitle || form.value.previewDescription || form.value.previewImageUrl),
)

// Wenn URL oder Typ sich ändern: Vorschau neu laden – aber erst 600ms nach der letzten Eingabe.
watch(
  () => [form.value.url, form.value.type],
  () => {
    clearPreview()
    if (debounceTimer) clearTimeout(debounceTimer)

    // Bei "Dokument" gibt es kein URL-Feld -> eine evtl. getippte URL verwerfen
    if (form.value.type !== 'LINK') {
      form.value.url = ''
      return
    }
    if (!form.value.url.trim()) return

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
    const postId = response.data.id

    // Bei Typ "Dokument" + gewählter Datei: Datei als multipart hochladen
    if (form.value.type === 'DOCUMENT' && selectedFile.value) {
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      await http.post(`/api/posts/${postId}/file`, formData)
    }

    await router.push(`/posts/${postId}`)
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
          maxlength="200"
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
          maxlength="5000"
          placeholder="Beschreibung / Inhalt"
        ></textarea>
      </div>

      <!-- Datei-Upload (nur bei Typ "Dokument") -->
      <div v-if="form.type === 'DOCUMENT'" class="field">
        <label>Dokument (PDF, PNG, JPG – max. 5 MB, optional)</label>
        <input class="input" type="file" accept=".pdf,.png,.jpg,.jpeg" @change="onFileChange" />
        <p v-if="fileError" class="file-error">{{ fileError }}</p>
      </div>

      <div v-if="form.type === 'LINK'" class="field">
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
.file-error {
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: 0.4rem;
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
