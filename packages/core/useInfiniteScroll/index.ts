import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useScroll, UseScrollOptions } from '../useScroll'
import { resolveElement } from '../_resolve-element'

type InfiniteScrollElement = HTMLElement | SVGElement | Window | Document | null | undefined

export interface UseInfiniteScrollOptions extends UseScrollOptions {
  direction?: 'top' | 'bottom' | 'left' | 'right'
  distance?: number
}

export function useInfiniteScroll<T extends InfiniteScrollElement>(
  element: MaybeRefOrGetter<T>,
  onLoadMore: (e?: Event) => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { direction = 'bottom', distance } = options
  console.log('element', element, toValue(element))

  // const state = reactive(
  //   useScroll(element as HTMLElement, {
  //     ...options,
  //     offset: {
  //       [direction]: distance ?? 0,
  //       ...options.offset
  //     }
  //   })
  // )

  // const promise = ref<any>()
  // const isLoading = computed(() => !!promise.value)

  // const observedElement = computed(() => {
  //   return resolveElement(toValue(element))
  // })

  function checkAndLoad() {
    // state.measure()
    // if (!observedElement.value) return
    // const { scrollHeight, scrollWidth, clientWidth, clientHeight } = observedElement.value as HTMLElement
    // // 元素内的内容没有溢出或者元素为空时，scrollHeight 会小于或等于 clientHeight
    // const isNarrower =
    //   direction === 'top' || direction === 'bottom' ? scrollHeight <= clientHeight : scrollWidth <= clientWidth
    // if (isNarrower) {
    //   if (!promise.value) {
    //     Promise.all([onLoadMore()]).finally(() => {
    //       nextTick(() => checkAndLoad())
    //     })
    //   }
    // }
    // onLoadMore()
  }

  // watch([() => state.arrivedState[direction]], checkAndLoad, { immediate: true })

  return {
    // isLoading
  }
}
