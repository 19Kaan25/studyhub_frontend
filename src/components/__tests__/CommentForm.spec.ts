import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentForm from '../CommentForm.vue'

describe('CommentForm.vue', () => {
  it('sendet den eingegebenen Text als submit-Event', async () => {
    const wrapper = mount(CommentForm)

    await wrapper.find('textarea').setValue('Sehr hilfreich!')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual(['Sehr hilfreich!'])
  })

  it('sendet nichts bei leerer Eingabe', async () => {
    const wrapper = mount(CommentForm)

    await wrapper.find('textarea').setValue('   ')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeFalsy()
  })
})
