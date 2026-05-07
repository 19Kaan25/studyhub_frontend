<script setup lang="ts">
import ResourceList from './components/ResourceList.vue'
</script>

<template>
  <header>
    <h1>StudyHub - HTW Berlin</h1>
  </header>

  <main>
    <ResourceList />
  </main>
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-family: sans-serif;
}
main {
  display: flex;
  justify-content: center;
}
</style>
