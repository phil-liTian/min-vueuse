import { defineComponent, reactive } from 'vue'
import { useMouse } from '.'

export const UseMouse = defineComponent({
  props: {
    
  },
  setup(props, { slots }) {
    const data = reactive(useMouse())
    return () => {
      if ( slots.default ) {
        return slots.default(data)
      }
    }
  }
})