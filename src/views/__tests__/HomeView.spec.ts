import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import http from '../../api/http'

// RouterLink wird durch ein einfaches <a> ersetzt (wir navigieren im Test nicht).
const RouterLinkStub = { template: '<a><slot /></a>' }

// http (Axios) mocken, damit keine echten Anfragen ans Backend gehen.
vi.mock('../../api/http', () => ({
  default: {
    get: vi.fn(),
  },
}))
const mockedGet = vi.mocked(http.get)

function mountHome() {
  return mount(HomeView, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('HomeView.vue (Use Case: Feed ansehen)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('zeigt den Seitentitel an', () => {
    mockedGet.mockResolvedValue({ data: [] })
    const wrapper = mountHome()
    expect(wrapper.find('h2').text()).toBe('Zuletzt erstellte Posts')
  })

  it('zeigt "keine Posts", wenn die geladene Liste leer ist', async () => {
    mockedGet.mockResolvedValue({ data: [] })
    const wrapper = mountHome()
    await flushPromises() // warten, bis der onMounted-Fetch fertig ist
    expect(wrapper.text()).toContain('Noch keine Posts vorhanden.')
  })

  it('zeigt die Posts an, die vom Backend geliefert werden', async () => {
    mockedGet.mockResolvedValue({
      data: [
        { id: 1, title: 'Spring Boot Guide', content: 'Inhalt', url: '', type: 'DOCUMENT' },
        { id: 2, title: 'Vue Doku', content: '', url: 'https://vuejs.org', type: 'LINK' },
      ],
    })
    const wrapper = mountHome()
    await flushPromises()

    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Spring Boot Guide')
    expect(wrapper.text()).toContain('Vue Doku')
  })

  it('zeigt eine Fehlermeldung, wenn der Request fehlschlägt', async () => {
    mockedGet.mockRejectedValue(new Error('Netzwerkfehler'))
    const wrapper = mountHome()
    await flushPromises()
    expect(wrapper.text()).toContain('Posts konnten nicht geladen werden.')
  })
})
