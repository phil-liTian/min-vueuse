import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent } from "vue";

const App = defineComponent({

})

describe('vOnKeyStroke', () => {
  let onUpdate = vi.fn()
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = mount(App, {

    })
  })
  it('it should be defined', () => {
    expect(wrapper).toBeDefined()
  })
})