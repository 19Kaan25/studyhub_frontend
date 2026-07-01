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
  <div class="auth card">
    <h2>Einloggen</h2>

    <form @submit.prevent="submit">
      <div class="field">
        <label>E-Mail</label>
        <input class="input" v-model="email" type="email" required placeholder="du@beispiel.de" />
      </div>
      <div class="field">
        <label>Passwort</label>
        <input class="input" v-model="password" type="password" required placeholder="••••••••" />
      </div>

      <button class="btn btn-primary btn-full" type="submit" :disabled="submitting">
        {{ submitting ? 'Wird geprüft…' : 'Einloggen' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error msg">{{ errorMessage }}</p>

    <p class="switch">
      Noch kein Konto? <RouterLink to="/register">Jetzt registrieren</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth {
  max-width: 400px;
  margin: 2rem auto;
}
h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}
.msg {
  margin-top: 1rem;
}
.switch {
  margin-top: 1.2rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--muted);
}
</style>
