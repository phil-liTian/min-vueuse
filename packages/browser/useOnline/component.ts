import { defineComponent, reactive } from "vue";
import { useOnline } from ".";


export const UseOnline = defineComponent({
  setup(props, { slots }) {
    const data = reactive({
      isOnline: useOnline(props)
    })
    
    return () => {
      if( slots.default ) {
        return slots.default(data)
      }
    }
  }
})