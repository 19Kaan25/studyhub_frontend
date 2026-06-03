<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const form = ref({ name: '', description: '', image: '', url: '', category: '' })
const successMessage = ref('')
const errorMessage = ref('')

async function createResource() {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    const response = await axios.post('https://studyhub-backend-x13o.onrender.com/resources', form.value)
    successMessage.value = `Resource "${response.data.name}" wurde erfolgreich erstellt (ID: ${response.data.id})`
    form.value = { name: '', description: '', image: '', url: '', category: '' }
  } catch {
    errorMessage.value = 'Fehler beim Erstellen der Resource.'
  }
}
</script>

<template>
  <div class="create-view">
    <h2>Neue Resource erstellen</h2>

    <form @submit.prevent="createResource">
      <div class="field">
        <label>Name</label>
        <input v-model="form.name" type="text" required placeholder="z.B. Spring Boot Tutorial" />
      </div>
      <div class="field">
        <label>Beschreibung</label>
        <input v-model="form.description" type="text" placeholder="Kurze Beschreibung" />
      </div>
      <div class="field">
        <label>Bild-URL</label>
        <input v-model="form.image" type="text" placeholder="https://..." />
      </div>
      <div class="field">
        <label>URL</label>
        <input v-model="form.url" type="text" placeholder="https://..." />
      </div>
      <div class="field">
        <label>Kategorie</label>
        <input v-model="form.category" type="text" placeholder="z.B. Video, PDF, Artikel" />
      </div>

      <button type="submit">Erstellen</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
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

.field input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
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

button:hover {
  background-color: #1a252f;
}

.success {
  color: green;
  margin-top: 16px;
}

.error {
  color: red;
  margin-top: 16px;
}
</style>
