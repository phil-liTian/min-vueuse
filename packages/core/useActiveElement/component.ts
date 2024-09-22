import { defineComponent, reactive } from 'vue'
import { useActiveElement } from '.'

export const UseActiveElement = defineComponent({
  name: 'UseActiveElement',
  setup(props, { slots }) {
    const data = reactive({
      element: useActiveElement()
    })

    return () => {
      if (slots.default) {
        return slots.default(data)
      }
    }
  }
})
