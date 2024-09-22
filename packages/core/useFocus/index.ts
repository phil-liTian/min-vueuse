import { computed, ComputedRef, ref, watch } from 'vue'
import { ConfigableWindow } from '../_configurable'
import { MaybeElementRef, unRefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface UseFocusOptions extends ConfigableWindow {
  // 默认是否自动聚焦
  initialValue?: boolean

  // 是否只有具备:focus-visible的元素才可聚焦
  focusVisible?: boolean
}

export interface UseFocusReturn {
  focused: ComputedRef<boolean>
}

export function useFocus(target: MaybeElementRef, options: UseFocusOptions = {}) {
  const { initialValue = false, focusVisible = false } = options
  const innerFocus = ref(false)
  const targetElement = computed(() => unRefElement(target))

  useEventListener(targetElement, 'focus', (event) => {
    // matches 特定的 CSS 选择器匹配
    if (!focusVisible || (event.target as HTMLElement)?.matches(':focus-visible')) {
      innerFocus.value = true
    }
  })

  useEventListener(targetElement, 'blur', () => {
    innerFocus.value = false
  })

  const focused = computed({
    get() {
      return innerFocus.value
    },
    set(value: boolean) {
      if (value && !innerFocus.value) {
        targetElement.value?.focus()
      } else if (!value && innerFocus.value) {
        targetElement.value?.blur()
      }
    }
  })

  watch(
    targetElement,
    () => {
      focused.value = initialValue
    },
    { immediate: true, flush: 'post' }
  )

  return { focused }
}
