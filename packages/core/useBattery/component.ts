import { defineComponent, reactive } from "vue";
import { useBattery } from ".";


export const UseBattery = defineComponent({
  name: 'UseBattery',
  setup(props, { slots }) {
    const data = reactive(useBattery())
    return () => {
      if (slots.default) {
        return slots.default(data)
      }
    }
  }
})