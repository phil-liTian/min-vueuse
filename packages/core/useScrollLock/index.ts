import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { computed, ref, watch } from 'vue'
import { resolveElement } from '../_resolve-element'

export function useScrollLock(
  element: MaybeRefOrGetter<HTMLElement | SVGElement | Document | Window | null | undefined>,
  initialState: boolean = false
) {
  const isLocked = ref(initialState)
  let initialOverflow: CSSStyleDeclaration['overflow'] = ''

  watch(
    () => element,
    (el) => {
      const target = resolveElement(toValue(el))
      if (target) {
        const ele = target as HTMLElement
        if (ele.style.overflow !== 'hidden') {
          initialOverflow = ele.style.overflow
        }

        if (ele.style.overflow === 'hidden') {
          return (isLocked.value = true)
        }

        if (isLocked.value) {
          ele.style.overflow = 'hidden'
        }
      }
    },
    { immediate: true }
  )

  function lock() {
    const el = resolveElement(toValue(element))
    if (!el || isLocked.value) return
    el.style.overflow = 'hidden'
    isLocked.value = true
  }

  function unLock() {
    const el = resolveElement(toValue(element))
    if (!el || !isLocked.value) return
    el.style.overflow = initialOverflow
    isLocked.value = false
  }

  return computed({
    get() {
      return isLocked.value
    },
    set(v) {
      console.log('v', v)

      v ? lock() : unLock()
    }
  })
}
