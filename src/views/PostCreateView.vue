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
</style>
