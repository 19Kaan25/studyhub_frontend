<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface Resource {
  id: number
  name: string
  description: string
  image: string
  url: string
  category: string
}

const resources = ref<Resource[]>([])
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await axios.get<Resource[]>('https://studyhub-backend-x13o.onrender.com/resources')
    resources.value = response.data.slice().reverse()
  } catch {
    errorMessage.value = 'Ressourcen konnten nicht geladen werden.'
  }
})
</script>

<template>
  <div class="home-view">
    <h2>Zuletzt erstellte Ressourcen</h2>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <ul v-if="resources.length > 0">
      <li v-for="resource in resources" :key="resource.id">
        <strong>{{ resource.name }}</strong>
        <span v-if="resource.category"> ({{ resource.category }})</span>
        <br />
        <span v-if="resource.description" class="description">{{ resource.description }}</span>
        <br v-if="resource.description" />
        <a v-if="resource.url" :href="resource.url" target="_blank">Zur Ressource</a>
      </li>
    </ul>

    <p v-else-if="!errorMessage">Noch keine Ressourcen vorhanden.</p>
  </div>
</template>

<style scoped>
.home-view {
  background-color: whitesmoke;
  color: black;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  font-family: sans-serif;
}

h2 {
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #ddd;
}

.description {
  color: #555;
  font-size: 14px;
}

a {
  color: #2c3e50;
  font-size: 14px;
}

.error {
  color: red;
}
</style>
