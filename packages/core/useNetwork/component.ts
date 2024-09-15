import { defineComponent, reactive } from "vue";
import { useNetwork } from ".";


export const UseNetwork = defineComponent({
  setup(props, { slots }) {
    return () => {
      const data = reactive(useNetwork())
      if ( slots.default )
        return slots.default(data)
    }
  }
})