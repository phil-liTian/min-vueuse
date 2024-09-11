import { defineComponent } from "vue";
import { useNow } from ".";


export const UseNow = defineComponent({
  name: 'UseNow',
  props: ['interval'],
  setup(props, { slots }) {
    const data = useNow({ ...props })
    return () => {
      if ( slots.default ) {
        return slots.default(data)
      }
    }
  }
})