import { directiveHooks } from '@mini-vueuse/shared'
import { ObjectDirective } from 'vue'
import { useInfiniteScroll, UseInfiniteScrollOptions } from '.'

type BindingValueFunction = (e?: Event) => void
type BindingValueArray = [BindingValueFunction, UseInfiniteScrollOptions]

export const vInfiniteScroll: ObjectDirective<HTMLElement, BindingValueFunction | BindingValueArray> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      useInfiniteScroll(el, binding.value)
    } else {
      const [handler, options] = binding.value
      useInfiniteScroll(el, handler, options)
    }
  }
}
