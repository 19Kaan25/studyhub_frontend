import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import http from '../../api/http'

// 1. Wir "mocken" (faken) den Vue-Router, da wir im Test nicht wirklich navigieren
const RouterLinkStub = { template: '<a><slot /></a>' }

// 2. Wir mocken Axios, damit keine echten Anfragen ans Backend gehen
vi.mock('../../api/http', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockedHttp = vi.mocked(http.get)

describe('HomeView.vue (Use Case: Feed ansehen)', () => {
  it('zeigt den korrekten Seitentitel an', async () => {
    // Wir sagen dem gefakten Backend, was es antworten soll (hier: eine leere Liste)
    mockedHttp.mockResolvedValue({ data: [] })

    // Wir "mounten" (rendern) die Komponente virtuell
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    // Wir prüfen, ob das h2-Element den richtigen Text enthält
    expect(wrapper.find('h2').text()).toBe('Zuletzt erstellte Posts')
  })

  it('zeigt eine Nachricht, wenn noch keine Posts vorhanden sind', async () => {
    mockedHttp.mockResolvedValue({ data: [] })

    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    // Vue aktualisiert das DOM asynchron, deshalb warten wir kurz (flushPromises)
    // Da wir hier ein einfaches Beispiel haben, suchen wir direkt nach dem Text:
    expect(wrapper.text()).toContain('Noch keine Posts vorhanden.')
  })
})
