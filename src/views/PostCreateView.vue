<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '../api/http'
import type { Post, PostType } from '../types/post'

const router = useRouter()

const form = ref<{ title: string; content: string; url: string; type: PostType }>({
  title: '',
  content: '',
  url: '',
  type: 'DOCUMENT',
})
const errorMessage = ref('')
const submitting = ref(false)

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
  <div class="create-view">
    <h2>Neuen Post erstellen</h2>

    <form @submit.prevent="createPost">
      <div class="field">
        <label>Titel</label>
        <input v-model="form.title" type="text" required placeholder="z.B. Spring Boot Tutorial" />
      </div>

      <div class="field">
        <label>Typ</label>
        <select v-model="form.type">
          <option value="DOCUMENT">Dokument</option>
          <option value="LINK">Link</option>
        </select>
      </div>

      <div class="field">
        <label>Inhalt</label>
        <textarea v-model="form.content" rows="4" placeholder="Beschreibung / Inhalt"></textarea>
      </div>

      <div class="field">
        <label>URL</label>
        <input v-model="form.url" type="text" placeholder="https://..." />
      </div>

      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Wird erstellt…' : 'Erstellen' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.create-view {
  background-color: whitesmoke;
  color: black;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
  font-family: sans-serif;
}

h2 {
  margin-bottom: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
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

button {
  margin-top: 8px;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #1a252f;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 16px;
}
</style>
