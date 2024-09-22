import { directiveHooks } from '@mini-vueuse/shared'
import { useElementHover } from '.'
import { watch } from 'vue'

export const vElementHover = {
  [directiveHooks.mounted]: (el, binding) => {
    useElementHover(el, binding.value)
    if (typeof binding.value === 'function') {
      const isHovered = useElementHover(el, binding.value)
      watch(isHovered, binding.value)
    } else if (Array.isArray(binding.value)) {
      const [handle, options] = binding.value
      const isHovered = useElementHover(el, options)
      watch(isHovered, handle)
    }
  }
}
