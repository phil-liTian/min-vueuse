import { defineComponent, reactive } from "vue";
import { useIdle } from ".";


export const UseIdle = defineComponent({
  props: [ 'timeout', 'initialState', 'listenVisibilityChange' ],
  setup(props, { slots }) {
    const data = reactive(useIdle(props.timeout, props))
    return () => {
      if ( slots.default ) {
        return slots.default(data)
      }
    }
  }
})