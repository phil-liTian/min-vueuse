import { defineComponent, reactive } from "vue";
import { useClipboard } from ".";


export const UseClipboard = defineComponent({
  props: ['source'],
  setup(props, { slots }) {
    const data = reactive(useClipboard(props))

    return () => slots.default?.(data)
  }
})