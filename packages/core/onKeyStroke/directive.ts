import { directiveHooks } from "@mini-vueuse/shared";
import { onKeyStroke } from ".";

export const vOnKeyStroke = {
  [directiveHooks.mounted](el, binding) {
    const keys = binding.arg.split(',') || true

    if (typeof binding.value === 'function') {
      onKeyStroke(keys, binding.value, { target: el })
    } else {
      const [handler, options] = binding.value
      onKeyStroke(keys, handler, { target: el, ...options })
    }
  },

  [directiveHooks.unmounted](el) {

  }
}