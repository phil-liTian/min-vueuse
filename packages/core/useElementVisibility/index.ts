import { MaybeRefOrGetter } from '@mini-vueuse/shared'
import { ConfigableWindow, defaultWindow } from '../_configurable'
import { MaybeComputedElementRef } from '../unrefElement'
import { useIntersectionObserver, UseIntersectionObserverOptions } from '../useIntersectionObserver'
import { ref } from 'vue'

export interface UseElementVisibilityOptions
  extends ConfigableWindow,
    Pick<UseIntersectionObserverOptions, 'threshold'> {
  scrollTarget?: MaybeRefOrGetter<HTMLElement | undefined | null>
}

// 返回元素的可见状态
export function useElementVisibility(element: MaybeComputedElementRef, options: UseElementVisibilityOptions = {}) {
  const { window = defaultWindow, scrollTarget } = options
  const elementIsVisible = ref(false)

  useIntersectionObserver(
    element,
    (intersectionObserverEntries) => {
      let isIntersecting = elementIsVisible.value
      let latestTime = 0
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= latestTime) {
          latestTime = entry.time
          isIntersecting = entry.isIntersecting
        }
      }
      elementIsVisible.value = isIntersecting
    },
    {
      root: scrollTarget,
      rootMargin: '0px',
      threshold: options.threshold || 0
    }
  )

  return elementIsVisible
}
