import { defineComponent, reactive } from "vue";
import { usePageLeave } from ".";


export const UsePageLeave = defineComponent({
  setup(props, { slots }) {
    const data = reactive({ isLeft: usePageLeave(props) })
    return () => {
      if ( slots.default ) {
        return slots.default(data)
      }
    }
  }
})