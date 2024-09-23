import { defineComponent, h, reactive, ref } from 'vue'
import { useElementVisibility } from '.'

export const UseElementVisibility = defineComponent({
  props: ['as'],
  setup(props, { slots }) {
    const target = ref()
    const data = reactive({
      isVisible: useElementVisibility(target)
    })
    return () => {
      if (slots.default) {
        return h(props.as || 'div', { ref: target }, slots.default(data))
      }
    }
  }
})
