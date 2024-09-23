import { directiveHooks } from '@mini-vueuse/shared'
import { ObjectDirective } from 'vue'
import { useScroll, UseScrollOptions, UseScrollReturn } from '.'

type BindingValueFunction = (state: UseScrollReturn) => void
type BindingValueArray = [BindingValueFunction, UseScrollOptions]

export const vScroll: ObjectDirective<HTMLElement, BindingValueFunction | BindingValueArray> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      const handler = binding.value
      const state = useScroll(el, {
        onScroll: () => handler(state),
        onStop: () => handler(state)
      })
    } else {
      const [handler, options] = binding.value
      const state = useScroll(el, {
        onScroll: () => handler(state),
        onStop: () => handler(state),
        ...options
      })
    }
  }
}
