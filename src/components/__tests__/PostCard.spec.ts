import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PostCard from '../PostCard.vue'
import http from '../../api/http'
import type { Post } from '../../types/post'

const RouterLinkStub = { template: '<a><slot /></a>' }

vi.mock('../../api/http', () => ({
  default: {
    get: vi.fn<() => Promise<unknown>>(),
    post: vi.fn<() => Promise<unknown>>().mockResolvedValue({}),
    delete: vi.fn<() => Promise<unknown>>().mockResolvedValue({}),
  },
  API_BASE_URL: 'http://localhost:8080',
}))

const beispielPost: Post = {
  id: 7,
  title: 'Meine Zusammenfassung',
  content: 'Kurzer Inhalt',
  url: '',
  type: 'DOCUMENT',
}

function mountCard(post: Post = beispielPost) {
  return mount(PostCard, {
    props: { post },
    global: {
      plugins: [createPinia()],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('PostCard.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('zeigt Titel und Typ-Badge an', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Meine Zusammenfassung')
    expect(wrapper.find('.badge').text()).toBe('Dokument')
  })

  it('zeigt den Favoriten-Stern nur für eingeloggte Nutzer', () => {
    // Ausgeloggt: kein Stern
    expect(mountCard().find('.fav-btn').exists()).toBe(false)

    // Eingeloggt: Stern sichtbar
    localStorage.setItem('token', 'test-token')
    setActivePinia(createPinia())
    expect(mountCard().find('.fav-btn').exists()).toBe(true)
  })

  it('favorisiert einen Post per Klick auf den Stern', async () => {
    localStorage.setItem('token', 'test-token')
    setActivePinia(createPinia())
    const wrapper = mountCard()

    await wrapper.find('.fav-btn').trigger('click')

    expect(http.post).toHaveBeenCalledWith('/api/posts/7/favorite')
  })
})
