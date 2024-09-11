import { defineComponent } from "vue";
import { useTimeAgo } from ".";

export const UseTimeAgo = defineComponent({
  name: 'UseTimeAgo',
  props: ['time', 'max', 'units', 'rounding', 'showSecond', 'messages', 'fullDateFormatter'],
  setup(props, { slots }) {
    return () => {
      const data = useTimeAgo(props.time, { ...props, controls: true })
      if ( slots.default ) {
        return slots.default(data)
      }
    }
  }
})