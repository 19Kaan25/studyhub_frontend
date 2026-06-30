<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const submitting = ref(false)

async function submit() {
  errorMessage.value = ''
  submitting.value = true
  try {
    await auth.login(email.value, password.value)
    await router.push('/')
  } catch {
    errorMessage.value = 'Login fehlgeschlagen. E-Mail oder Passwort falsch.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-view">
    <h2>Einloggen</h2>

    <form @submit.prevent="submit">
      <div class="field">
        <label>E-Mail</label>
        <input v-model="email" type="email" required placeholder="du@beispiel.de" />
      </div>
      <div class="field">
        <label>Passwort</label>
        <input v-model="password" type="password" required placeholder="••••••••" />
      </div>

      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Wird geprüft…' : 'Einloggen' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p class="switch">
      Noch kein Konto? <RouterLink to="/register">Jetzt registrieren</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-view {
  background-color: whitesmoke;
  color: black;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
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

.field input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

button {
  margin-top: 8px;
  width: 100%;
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

.switch {
  margin-top: 20px;
  font-size: 14px;
}

.switch a {
  color: #2c3e50;
}
</style>
