import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '../api/http'
import type { Post } from '../types/post'

/**
 * Hält die IDs der Posts, die der eingeloggte User favorisiert hat.
 * So können Feed, "Meine Posts" und Detailansicht den Stern-Zustand anzeigen,
 * ohne für jeden Post einzeln nachzufragen.
 */
export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<Set<number>>(new Set())
  const loaded = ref(false)

  function isFavorite(postId: number) {
    return ids.value.has(postId)
  }

  // Favoriten vom Backend holen (nur nötig, wenn eingeloggt). Gibt die favorisierten
  // Posts zurück, damit die Favoriten-Seite sie direkt anzeigen kann.
  async function load(): Promise<Post[]> {
    const response = await http.get<Post[]>('/api/favorites/mine')
    ids.value = new Set(response.data.map((post) => post.id))
    loaded.value = true
    return response.data
  }

  // Favorit an-/abschalten. Der lokale Zustand wird erst nach Erfolg angepasst.
  async function toggle(postId: number) {
    if (ids.value.has(postId)) {
      await http.delete(`/api/posts/${postId}/favorite`)
      ids.value.delete(postId)
    } else {
      await http.post(`/api/posts/${postId}/favorite`)
      ids.value.add(postId)
    }
  }

  // Beim Logout zurücksetzen, damit kein fremder Zustand hängen bleibt.
  function reset() {
    ids.value = new Set()
    loaded.value = false
  }

  return { ids, loaded, isFavorite, load, toggle, reset }
})
