import { directiveHooks } from '@mini-vueuse/shared'
import { onClickOutside } from '.';

export const vOnClickOutside = {
  [directiveHooks.mounted](el, binding) {
    // const par
    const { capture } = binding.modifiers

    if (typeof binding.value === 'function') {
      el.__onClickOutside_stop = onClickOutside(el, binding.value, { capture })
    } else {
      const [handler, options] = binding.value
      el.__onClickOutside_stop = onClickOutside(el, handler, { capture, ...options })
    }
  },

  [directiveHooks.unmounted](el) {
    el.__onClickOutside_stop()
  }
}
