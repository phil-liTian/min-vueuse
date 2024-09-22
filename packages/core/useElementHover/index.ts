import { MaybeRefOrGetter } from '@mini-vueuse/shared'
import { ConfigableWindow, defaultWindow } from '../_configurable'
import { ref } from 'vue'
import { useEventListener } from '../useEventListener'

export interface UseElementHoverOptions extends ConfigableWindow {
  delayEnter?: number
  delayLeave?: number
}
export function useElementHover(
  el: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseElementHoverOptions = {}
) {
  const { window = defaultWindow, delayEnter = 0, delayLeave = 0 } = options
  let isHovered = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const toggle = (enterFlag: boolean) => {
    const delay = enterFlag ? delayEnter : delayLeave
    if (timer) {
      clearTimeout(timer)
    }
    if (delay) {
      timer = setTimeout(() => {
        isHovered.value = enterFlag
      }, delay)
    } else {
      isHovered.value = enterFlag
    }
  }

  if (!window) return isHovered

  useEventListener(el, 'mouseenter', () => toggle(true), { passive: true })
  useEventListener(el, 'mouseleave', () => toggle(false), { passive: true })

  return isHovered
}
