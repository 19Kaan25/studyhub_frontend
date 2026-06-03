<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import axios from 'axios'

const studyResources = ref([
  {
    id: 1,
    title: 'Einführung in Spring Boot',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=EfsKx7yiagk',
  },
  {
    id: 2,
    title: 'Datenbanktechnologien Probeklausur',
    type: 'PDF',
    url: 'https://www.studocu.com/de/u/121521979?sid=01778169061&page=1',
  },
  {
    id: 3,
    title: 'Webtech Rest API: Alle Ressourcen lesen',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=85aAoUil_cI&list=PLt0vU-SI8XGZK_AruyDCZWDR-1XBcOrSI&index=4',
  },
])

type Demo = { name: string; age: number }
const demos: Ref<Demo[]> = ref([])

onMounted(() => {
  axios
    .get<Demo[]>('https://studyhub-backend-x13o.onrender.com/demo')
    .then((response) => (demos.value = response.data))
    .catch((error) => console.log(error))
})
</script>

<template>
  <div class="demo-view">
    <h2>Zuletzt geteilte Lernmaterialien</h2>
    <ul>
      <li v-for="resource in studyResources" :key="resource.id">
        <strong>{{ resource.title }}</strong> ({{ resource.type }})
        <br />
        <a :href="resource.url" target="_blank">Zur Ressource</a>
      </li>
    </ul>

    <h2>Demo-Nutzer</h2>
    <ul>
      <li v-for="demo in demos" :key="demo.name">
        <strong>{{ demo.name }}</strong> ({{ demo.age }})
      </li>
    </ul>
  </div>
</template>

<style scoped>
.demo-view {
  background-color: whitesmoke;
  color: black;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}
li {
  margin-bottom: 15px;
}
</style>
