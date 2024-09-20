import { defineComponent, h, ref } from 'vue'
import { onLongPress } from '.'

export const OnLongPress = defineComponent({
  props: ['as', 'delay'],
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const { as, ...otherProps } = props
    const target = ref<HTMLElement | null>(null)

    onLongPress(
      target,
      (e) => {
        emit('trigger', e)
      },
      otherProps
    )
    return () => {
      if (slots.default) {
        return h(props.as || 'div', { ref: target }, slots.default())
      }
    }
  }
})
