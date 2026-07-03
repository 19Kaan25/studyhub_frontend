<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ submit: [content: string] }>()

const content = ref('')

function onSubmit() {
  const text = content.value.trim()
  if (!text) return
  emit('submit', text)
  content.value = ''
}
</script>

<template>
  <form class="comment-form" @submit.prevent="onSubmit">
    <textarea
      v-model="content"
      class="input"
      rows="3"
      placeholder="Schreib einen Kommentar…"
      maxlength="1000"
    ></textarea>
    <button class="btn btn-primary" type="submit" :disabled="!content.trim()">Kommentieren</button>
  </form>
</template>

<style scoped>
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.comment-form button {
  align-self: flex-start;
}
</style>
