import { computed, reactive, ref } from 'vue'
import { ConfigableWindow, defaultWindow } from '../_configurable'
import { MaybeComputedElementRef, unRefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { MaybeRefOrGetter, noop, toValue } from '@mini-vueuse/shared'

const ARRIVED_STATE_THRESHOLD_PIXELS = 1
export interface UseScrollOptions extends ConfigableWindow {
  offset?: {
    left?: number
    top?: number
    right?: number
    bottom?: number
  }

  behavior?: MaybeRefOrGetter<ScrollBehavior>

  onScroll?: (e: Event) => void
  onStop?: (e: Event) => void
}
export function useScroll(
  element: MaybeRefOrGetter<HTMLElement | SVGAElement | undefined | null | Document | Window>,
  options: UseScrollOptions = {}
) {
  const {
    window = defaultWindow,
    onScroll = noop,
    onStop = noop,
    behavior = 'auto',
    offset = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  } = options

  const internalX = ref(0)
  const internalY = ref(0)
  const isScrolling = ref(false)
  // 是否贴边
  const arrivedState = reactive({
    left: true,
    top: true,
    bottom: false,
    right: false
  })

  // 滚动方向
  const directions = reactive({
    left: false,
    top: false,
    bottom: false,
    right: false
  })

  const x = computed({
    get() {
      return internalX.value
    },
    set(value) {
      scrollTo(value, undefined)
    }
  })

  const y = computed({
    get() {
      return internalY.value
    },
    set(value) {
      scrollTo(undefined, value)
    }
  })

  function scrollTo(_x: number | undefined, _y: number | undefined) {
    if (!window) return
    const _element = toValue(element)
    if (!_element) return
    ;(_element instanceof Document ? document.documentElement : _element).scrollTo({
      top: toValue(_y) ?? y.value,
      left: toValue(_x) ?? x.value,
      behavior: toValue(behavior)
    })

    const scrollContainer =
      (_element as Window)?.document?.documentElement ?? (_element as Document)?.documentElement ?? _element

    if (x != null) internalX.value = scrollContainer.scrollLeft
    if (y != null) internalY.value = scrollContainer.scrollTop
  }

  function setArrivedState(target: HTMLElement | SVGAElement | undefined | null | Document | Window) {
    if (!window || !target) return

    const el: Element =
      (target as Window)?.document?.documentElement ??
      (target as Document).documentElement ??
      unRefElement(target as HTMLElement)
    const { display } = getComputedStyle(el)
    const scrollLeft = el.scrollLeft

    directions.left = scrollLeft > internalX.value
    directions.right = scrollLeft < internalX.value

    // 小于等于offset.left则左贴边
    const left = Math.abs(scrollLeft) <= (offset.left || 0)
    // 大于等于(scrollWidth包括滚动区域的内容宽度)
    const right =
      Math.abs(scrollLeft) + el.clientWidth >= el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    arrivedState.left = left
    arrivedState.right = right
    internalX.value = el.scrollLeft

    let scrollTop = el.scrollTop
    directions.top = scrollTop > internalY.value
    directions.bottom = scrollTop < internalY.value
    const top = Math.abs(scrollTop) <= (offset.top || 0)
    const bottom =
      Math.abs(scrollTop) + el.clientHeight >= el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    arrivedState.top = top
    arrivedState.bottom = bottom
    internalY.value = scrollTop
  }

  const onScrollHandler = (e: Event) => {
    if (!window) return

    const eventTarget = ((e.target as Document).documentElement ?? e.target) as HTMLElement

    setArrivedState(eventTarget)

    isScrolling.value = true
    onScroll(e)
  }

  const onScrollEnd = (e: Event) => {
    if (!isScrolling.value) return

    isScrolling.value = false
    onStop(e)
  }

  useEventListener(element, 'scroll', onScrollHandler)

  useEventListener(element, 'scrollend', onScrollEnd)

  return {
    x,
    y,
    isScrolling,
    // 滚动移动方向
    directions,
    arrivedState,
    measure: () => {
      const _element = toValue(element)
      if (window && _element) {
        setArrivedState(_element)
      }
    }
  }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
