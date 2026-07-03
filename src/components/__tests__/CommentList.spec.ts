import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentList from '../CommentList.vue'
import type { Comment } from '../../types/comment'

const kommentare: Comment[] = [
  { id: 1, postId: 1, userId: 10, authorUsername: 'max', content: 'Erster Kommentar' },
  { id: 2, postId: 1, userId: 20, authorUsername: 'erika', content: 'Zweiter Kommentar' },
]

describe('CommentList.vue', () => {
  it('rendert alle Kommentare per v-for', () => {
    const wrapper = mount(CommentList, {
      props: { comments: kommentare, currentUserId: null },
    })
    expect(wrapper.findAll('.comment')).toHaveLength(2)
    expect(wrapper.text()).toContain('Erster Kommentar')
    expect(wrapper.text()).toContain('erika')
  })

  it('zeigt den Löschen-Button nur beim eigenen Kommentar', () => {
    // currentUserId = 10 -> nur der erste Kommentar (userId 10) ist löschbar
    const wrapper = mount(CommentList, {
      props: { comments: kommentare, currentUserId: 10 },
    })
    expect(wrapper.findAll('.delete')).toHaveLength(1)
  })

  it('emittiert delete mit der Kommentar-Id', async () => {
    const wrapper = mount(CommentList, {
      props: { comments: kommentare, currentUserId: 10 },
    })
    await wrapper.find('.delete').trigger('click')
    expect(wrapper.emitted('delete')![0]).toEqual([1])
  })

  it('zeigt einen Hinweis, wenn es keine Kommentare gibt', () => {
    const wrapper = mount(CommentList, {
      props: { comments: [], currentUserId: null },
    })
    expect(wrapper.text()).toContain('Noch keine Kommentare.')
  })
})
