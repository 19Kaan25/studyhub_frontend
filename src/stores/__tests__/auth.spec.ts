import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import http from '../../api/http'

// http (Axios) mocken – der Store soll nicht wirklich das Backend rufen.
vi.mock('../../api/http', () => ({
  default: {
    post: vi.fn(),
  },
}))
const mockedPost = vi.mocked(http.post)

describe('authStore', () => {
  beforeEach(() => {
    // Vor jedem Test: frische Pinia-Instanz + leeres localStorage.
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('ist am Anfang nicht eingeloggt', () => {
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.username).toBe(null)
  })

  it('speichert Token und User nach erfolgreichem Login', async () => {
    mockedPost.mockResolvedValue({ data: { token: 'abc123', username: 'bernd', userId: 7 } })
    const auth = useAuthStore()

    await auth.login('bernd@test.de', 'geheim123')

    expect(auth.isLoggedIn).toBe(true)
    expect(auth.username).toBe('bernd')
    expect(auth.userId).toBe(7)
    // Session wird auch im localStorage abgelegt (übersteht Reload)
    expect(localStorage.getItem('token')).toBe('abc123')
  })

  it('löscht Token und User beim Logout', async () => {
    mockedPost.mockResolvedValue({ data: { token: 'abc123', username: 'bernd', userId: 7 } })
    const auth = useAuthStore()
    await auth.login('bernd@test.de', 'geheim123')

    auth.logout()

    expect(auth.isLoggedIn).toBe(false)
    expect(auth.username).toBe(null)
    expect(localStorage.getItem('token')).toBe(null)
  })
})
