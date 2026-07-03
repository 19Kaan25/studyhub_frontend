import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FavoritesView from '../FavoritesView.vue'
import http from '../../api/http'

const RouterLinkStub = { template: '<a><slot /></a>' }

vi.mock('../../api/http', () => ({
  default: {
    get: vi.fn<() => Promise<unknown>>(),
    post: vi.fn<() => Promise<unknown>>(),
    delete: vi.fn<() => Promise<unknown>>(),
  },
  API_BASE_URL: 'http://localhost:8080',
}))
const mockedGet = vi.mocked(http.get)

function mountFavorites() {
  return mount(FavoritesView, {
    global: {
      plugins: [createPinia()],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('FavoritesView.vue (Use Case: Favoriten ansehen)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('zeigt die favorisierten Posts an', async () => {
    mockedGet.mockResolvedValue({
      data: [
        { id: 1, title: 'Favorit A', content: '', url: '', type: 'DOCUMENT' },
        { id: 2, title: 'Favorit B', content: '', url: '', type: 'LINK' },
      ],
    })
    const wrapper = mountFavorites()
    await flushPromises()

    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Favorit A')
    expect(wrapper.text()).toContain('Favorit B')
  })

  it('zeigt einen Hinweis, wenn keine Favoriten vorhanden sind', async () => {
    mockedGet.mockResolvedValue({ data: [] })
    const wrapper = mountFavorites()
    await flushPromises()

    expect(wrapper.text()).toContain('Du hast noch keine Posts favorisiert.')
  })
})
