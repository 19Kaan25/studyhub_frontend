<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const submitting = ref(false)

async function submit() {
  errorMessage.value = ''
  submitting.value = true
  try {
    await auth.register(username.value, email.value, password.value)
    await router.push('/')
  } catch (err) {
    if (axios.isAxiosError(err) && !err.response) {
      // Keine Response = Server gar nicht erreicht (z.B. Backend aus / kein Netz)
      errorMessage.value = 'Verbindung zum Server fehlgeschlagen. Bitte versuche es später erneut.'
    } else if (axios.isAxiosError(err) && err.response?.status === 409) {
      errorMessage.value = 'E-Mail oder Username ist bereits vergeben.'
    } else {
      errorMessage.value = 'Registrierung fehlgeschlagen. Bitte Eingaben prüfen.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth card">
    <h2>Registrieren</h2>

    <form @submit.prevent="submit">
      <div class="field">
        <label>Username</label>
        <input
          class="input"
          v-model="username"
          type="text"
          required
          minlength="3"
          placeholder="z.B. Max"
        />
      </div>
      <div class="field">
        <label>E-Mail</label>
        <input class="input" v-model="email" type="email" required placeholder="du@beispiel.de" />
      </div>
      <div class="field">
        <label>Passwort</label>
        <input
          class="input"
          v-model="password"
          type="password"
          required
          minlength="6"
          placeholder="mind. 6 Zeichen"
        />
      </div>

      <button class="btn btn-primary btn-full" type="submit" :disabled="submitting">
        {{ submitting ? 'Wird erstellt…' : 'Konto erstellen' }}
      </button>
    </form>

    <p v-if="errorMessage" class="error msg">{{ errorMessage }}</p>

    <p class="switch">Schon ein Konto? <RouterLink to="/login">Zum Login</RouterLink></p>
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
