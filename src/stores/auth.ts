import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '../api/http'

interface AuthResponse {
  token: string
  username: string
  userId: number
}

export const useAuthStore = defineStore('auth', () => {
  // Initialzustand aus dem localStorage wiederherstellen (Login übersteht Reload).
  const token = ref<string | null>(localStorage.getItem('token'))
  const username = ref<string | null>(localStorage.getItem('username'))
  const userId = ref<number | null>(
    localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  )

  const isLoggedIn = computed(() => token.value !== null)

  function setSession(data: AuthResponse) {
    token.value = data.token
    username.value = data.username
    userId.value = data.userId
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('userId', String(data.userId))
  }

  async function login(email: string, password: string) {
    const response = await http.post<AuthResponse>('/api/auth/login', { email, password })
    setSession(response.data)
  }

  async function register(usernameInput: string, email: string, password: string) {
    const response = await http.post<AuthResponse>('/api/auth/register', {
      username: usernameInput,
      email,
      password,
    })
    setSession(response.data)
  }

  function logout() {
    token.value = null
    username.value = null
    userId.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
  }

  return { token, username, userId, isLoggedIn, login, register, logout }
})
