import { ObjectDirective, watch } from 'vue'
import { useElementVisibility, UseElementVisibilityOptions } from '.'
import { directiveHooks } from '@mini-vueuse/shared'

type BindingValueFunction = (isVisible: boolean) => void

type BindingValueArray = [BindingValueFunction, UseElementVisibilityOptions]

export const vElementVisibility: ObjectDirective<HTMLElement, BindingValueFunction | BindingValueArray> = {
  [directiveHooks.mounted](el, binding) {
    if (typeof binding.value === 'function') {
      const handle = binding.value
      const isVisible = useElementVisibility(el)
      watch(isVisible, (v) => handle(v), { immediate: true })
    } else {
      const [handle, options] = binding.value
      const isVisible = useElementVisibility(el, options)
      watch(isVisible, (v) => handle(v), { immediate: true })
    }
  }
}
