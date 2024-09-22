import { computed, ComputedRef } from 'vue'
import { ConfigableWindow } from '../_configurable'
import { MaybeElementRef, unRefElement } from '../unrefElement'
import { useActiveElement } from '../useActiveElement'
export interface UseFocusWithinReturn {
  focused: ComputedRef<boolean>
}

export function useFocusWithin(target: MaybeElementRef, options: ConfigableWindow = {}) {
  const targetElement = computed(() => unRefElement(target))
  const activeElement = useActiveElement(options)

  const focused = computed(() =>
    targetElement.value && activeElement.value ? targetElement.value.contains(activeElement.value) : false
  )

  return { focused }
}
