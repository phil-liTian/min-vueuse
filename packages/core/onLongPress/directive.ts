import { directiveHooks } from '@mini-vueuse/shared'
import { ObjectDirective } from 'vue'
import { onLongPress, OnLongPressOptions } from '.'

type BindingValueFunction = (evt: PointerEvent) => void

type BindingValueArray = [BindingValueFunction, OnLongPressOptions]

export const vOnLongPress: ObjectDirective<HTMLElement, BindingValueFunction | BindingValueArray> = {
  [directiveHooks.mounted]: (el, binding) => {
    if (typeof binding.value === 'function') {
      onLongPress(el, binding.value, { modifiers: binding.modifiers })
    } else {
      onLongPress(el, ...(binding.value as BindingValueArray))
    }
  }
}
