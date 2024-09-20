import { computed, unref } from 'vue'
import { MaybeElementRef, unRefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { Position } from '../types'

const DEFAULT_DELAY = 500
const DEFAULT_THRESHOLD = 10

export interface OnLongPressModifiers {
  stop?: boolean
  once?: boolean
  prevent?: boolean
  capture?: boolean
  self?: boolean
}

export interface OnLongPressOptions {
  delay?: number

  // 移动距离太远 则取消handle事件
  distanceThreshold?: number | boolean

  modifiers?: OnLongPressModifiers
}

export function onLongPress(
  target: MaybeElementRef,
  handler: (event: PointerEvent) => void,
  options: OnLongPressOptions = {}
) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let posStart: Position | undefined
  let startTimeStamp: number | undefined
  const elementRef = computed(() => unRefElement(target))

  function clear() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    posStart = undefined
  }

  function onDown(event: PointerEvent) {
    if (options.modifiers?.self && event.target !== elementRef.value) return
    clear()

    if (options.modifiers?.stop) {
      event.stopPropagation()
    }

    if (options.modifiers?.prevent) {
      event.preventDefault()
    }

    posStart = {
      x: event.x,
      y: event.y
    }

    timeout = setTimeout(() => {
      handler(event)
    }, options.delay || DEFAULT_DELAY)
  }

  function onMove(event: PointerEvent) {
    if (options.modifiers?.self && event.target !== elementRef.value) return
    if (!posStart || options.distanceThreshold === false) return

    if (options.modifiers?.stop) {
      event.stopPropagation()
    }

    if (options.modifiers?.prevent) {
      event.preventDefault()
    }

    const dx = event.x - posStart!.x
    const dy = event.y - posStart!.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance >= ((options.distanceThreshold as number) ?? DEFAULT_THRESHOLD)) {
      clear()
    }
  }

  function onRelease(event: PointerEvent) {
    clear()

    if (options.modifiers?.self && event.target !== elementRef.value) return
    if (options.modifiers?.stop) {
      event.stopPropagation()
    }

    if (options.modifiers?.prevent) {
      event.preventDefault()
    }
  }

  const listenerOptions: AddEventListenerOptions = {
    capture: options.modifiers?.capture,
    once: options.modifiers?.once
  }

  const cleanup = [
    useEventListener(elementRef, 'pointerdown', onDown, listenerOptions),
    useEventListener(elementRef, 'pointermove', onMove, listenerOptions),
    useEventListener(elementRef, ['pointerup', 'pointerleave'], onRelease, listenerOptions)
  ]

  const stop = () => cleanup.map((fn) => fn())

  return stop
}
