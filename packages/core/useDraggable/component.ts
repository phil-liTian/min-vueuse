import { computed, defineComponent, h, reactive, ref } from 'vue'
import { useDraggable } from '.'

export const UseDraggable = defineComponent({
  props: [
    'axis',
    'buttons',
    'containerElement',
    'disabled',
    'draggingElement',
    'exact',
    'handle',
    'initialValue',
    'onEnd',
    'onMove',
    'onStart'
  ],
  setup(props, { slots }) {
    const target = ref<HTMLElement | null>(null)
    const handle = computed(() => props.handle ?? target.value)
    const data = reactive(useDraggable(target, { ...props, handle }))

    return () => {
      if (slots.default) {
        return h('div', { ref: target, style: data.style }, slots.default(data))
      }
    }
  }
})
