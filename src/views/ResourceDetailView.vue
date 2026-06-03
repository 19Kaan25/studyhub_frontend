<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface Resource {
  id: number
  name: string
  description: string
  image: string
  url: string
  category: string
}

const route = useRoute()
const resource = ref<Resource | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await axios.get<Resource>(
      `https://studyhub-backend-x13o.onrender.com/resources/${route.params.id}`,
    )
    resource.value = response.data
  } catch {
    errorMessage.value = `Resource mit ID ${route.params.id} nicht gefunden.`
  }
})
</script>

<template>
  <div class="detail-view">
    <div v-if="resource">
      <h2>{{ resource.name }}</h2>
      <p><strong>ID:</strong> {{ resource.id }}</p>
      <p><strong>Beschreibung:</strong> {{ resource.description }}</p>
      <p><strong>Kategorie:</strong> {{ resource.category }}</p>
      <p v-if="resource.url"><strong>URL:</strong> <a :href="resource.url" target="_blank">{{ resource.url }}</a></p>
      <p v-if="resource.image"><strong>Bild:</strong> <img :src="resource.image" alt="Resource Bild" /></p>
    </div>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else>Lade...</p>
  </div>
</template>

<style scoped>
.detail-view {
  background-color: whitesmoke;
  color: black;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
}

p {
  margin-bottom: 10px;
}

img {
  max-width: 100%;
  border-radius: 6px;
  margin-top: 6px;
}

.error {
  color: red;
}
</style>
