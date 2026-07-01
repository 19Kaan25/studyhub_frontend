import axios from 'axios'

// Zentrale Backend-Basis-URL. Überschreibbar per Vite-Env (VITE_API_BASE_URL),
// Fallback ist das deployte Render-Backend.
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'https://studyhub-backend-x13o.onrender.com'

const http = axios.create({
  baseURL: API_BASE_URL,
})

// Request-Interceptor: hängt das JWT an jeden ausgehenden Request.
// Token direkt aus localStorage gelesen, um einen Import-Zyklus mit dem authStore zu vermeiden.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response-Interceptor: bei 401 (Token abgelaufen/ungültig) Session verwerfen und zur Login-Seite.
// Ausnahme: die Auth-Endpunkte selbst (falsches Passwort soll nicht umleiten).
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url: string = error.config?.url ?? ''
    const isAuthCall = url.includes('/api/auth/')

    if (status === 401 && !isAuthCall) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default http
