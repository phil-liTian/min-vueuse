import { directiveHooks } from '@mini-vueuse/shared'
import { ObjectDirective } from 'vue'
import { useIntersectionObserver, UseIntersectionObserverOptions } from '.'

type BindingValueFunction = IntersectionObserverCallback
type BindingValueArray = [BindingValueFunction, UseIntersectionObserverOptions]

export const vIntersectionObserver: ObjectDirective<HTMLElement, BindingValueFunction | BindingValueArray> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      useIntersectionObserver(el, binding.value)
    } else {
      const [handler, options] = binding.value
      useIntersectionObserver(el, handler, options)
    }
  }
}
