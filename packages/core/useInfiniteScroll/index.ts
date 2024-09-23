import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useScroll, UseScrollOptions } from '../useScroll'
import { resolveElement } from '../_resolve-element'
import { useElementVisibility } from '../useElementVisibility'

type InfiniteScrollElement = HTMLElement | Window | Document | null | undefined

export interface UseInfiniteScrollOptions<T extends InfiniteScrollElement = InfiniteScrollElement>
  extends UseScrollOptions {
  direction?: 'top' | 'bottom' | 'left' | 'right'
  distance?: number
  canLoadMore?: (el: T) => boolean
  interval?: number
}

export function useInfiniteScroll<T extends InfiniteScrollElement>(
  element: MaybeRefOrGetter<T>,
  onLoadMore: (e?: Event) => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { direction = 'bottom', distance, canLoadMore = () => true, interval = 100 } = options
  const state = reactive(
    useScroll(element as HTMLElement, {
      ...options,
      offset: {
        [direction]: distance ?? 0,
        ...options.offset
      }
    })
  )

  const promise = ref<any>()
  const isLoading = computed(() => !!promise.value)

  const observedElement = computed<HTMLElement | undefined | null>(() => resolveElement(toValue(element)))

  const isElementVisible = useElementVisibility(observedElement)

  function checkAndLoad() {
    state.measure()

    if (!observedElement.value || !isElementVisible.value || !canLoadMore(observedElement.value)) return

    const { scrollHeight, scrollWidth, clientWidth, clientHeight } = observedElement.value as HTMLElement
    // 元素内的内容没有溢出或者元素为空时，scrollHeight 会小于或等于 clientHeight
    const isNarrower =
      direction === 'top' || direction === 'bottom' ? scrollHeight <= clientHeight : scrollWidth <= clientWidth

    if (isNarrower || state.arrivedState[direction]) {
      // 控制interval时间后才能继续执行onLoadMore
      if (!promise.value) {
        promise.value = Promise.all([onLoadMore(), new Promise((resolve) => setTimeout(resolve, interval))]).finally(
          () => {
            promise.value = null
            nextTick(() => checkAndLoad())
          }
        )
      }
    }
  }

  watch(() => [state.arrivedState[direction], isElementVisible.value], checkAndLoad, { immediate: true })

  return {
    isLoading,
    reset: () => {
      nextTick(() => checkAndLoad())
    }
  }
}
