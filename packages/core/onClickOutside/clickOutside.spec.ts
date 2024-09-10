import { describe, it, expect, beforeEach } from 'vitest'
import { vOnClickOutside } from './directive'
import { VueWrapper, mount } from '@vue/test-utils'


describe('vOnClickOutside', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount({
      props: {},
      global: {
        directives: {
          'on-click-outside': vOnClickOutside
        }
      }
    })
  })

  it('wrapper be defined', () => {
    expect(wrapper).toBeDefined()
  })
})