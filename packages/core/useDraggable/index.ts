import { isClient, MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { Position } from '../types'
import { computed, ref, toRefs } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseDraggableOptions {
  exact?: MaybeRefOrGetter<boolean>

  initialValue?: MaybeRefOrGetter<Position>

  draggingElement?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined | Window | Document>

  // 计算边界的element, 如果没有设置，则使用event的target
  containerElement?: MaybeRefOrGetter<HTMLElement | null | undefined>

  // 可拖动方向 x只可横向拖动, t只可纵向拖动
  axis?: 'x' | 'y' | 'both'

  // 精准控制点击哪个dom可以drag
  handle?: MaybeRefOrGetter<HTMLElement | null | undefined>

  // 控制可监听的鼠标点击事件 0：左键 2: 右键 4: 中键
  buttons?: MaybeRefOrGetter<number[]>

  disabled?: MaybeRefOrGetter<boolean>

  // 向外抛出事件
  onStart?: (position: Position, event: PointerEvent) => void

  onMove?: (position: Position, event: PointerEvent) => void

  onEnd?: (position: Position, event: PointerEvent) => void
}

export function useDraggable(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseDraggableOptions = {}
) {
  const {
    initialValue,
    draggingElement = defaultWindow,
    axis = 'both',
    containerElement,
    handle: draggingHandle = target,
    exact,
    onStart,
    onMove,
    onEnd,
    buttons = [0]
  } = options
  const pressedDelta = ref<Position>()
  const position = ref<Position>(toValue(initialValue) ?? { x: 0, y: 0 })

  const start = (e: PointerEvent) => {
    if (!toValue(buttons).includes(e.button)) return
    if (toValue(options.disabled)) return
    if (toValue(exact) && e.target !== toValue(target)) return

    const container = toValue(containerElement)
    const containerRect = container?.getBoundingClientRect()
    const targetRect = toValue(target)?.getBoundingClientRect()

    const pos = {
      // e.clientX点击时 鼠标位置距离浏览器视口左边的距离; targetRect!.left 拖动目标元素左上角距离视口的距离 差值为鼠标位置在target容器内的偏移量
      x: e.clientX - (container ? targetRect!.left - containerRect!.left + container.scrollLeft : targetRect!.left),
      y: e.clientY - (container ? targetRect!.top - containerRect!.top + container.scrollTop : targetRect!.top)
    }
    onStart?.(position.value, e)
    pressedDelta.value = pos
  }

  function move(e: PointerEvent) {
    if (toValue(options.disabled)) return
    if (!pressedDelta.value) return

    const container = toValue(containerElement)
    const targetRect = toValue(target)?.getBoundingClientRect()
    const containerRect = container?.getBoundingClientRect()
    let { x, y } = position.value

    if (axis === 'x' || axis === 'both') {
      x = e.clientX - pressedDelta.value.x
      if (container) {
        x = Math.min(Math.max(0, x), container.scrollWidth - targetRect!.width) + containerRect!.left
      }
    }

    if (axis === 'y' || axis === 'both') {
      y = e.clientY - pressedDelta.value.y
      if (container) {
        y = Math.min(Math.max(0, y), container.scrollHeight - targetRect!.height) + containerRect!.left
      }
    }

    position.value = { x, y }
    onMove?.(position.value, e)
  }

  function end(event: PointerEvent) {
    if (toValue(options.disabled)) return
    if (!pressedDelta.value) return
    pressedDelta.value = undefined

    onEnd?.(position.value, event)
  }

  if (isClient) {
    const config = {}
    useEventListener(draggingHandle, 'pointerdown', start)
    useEventListener(draggingElement, 'pointermove', move, config)
    useEventListener(draggingElement, 'pointerup', end)
  }

  return {
    ...toRefs(position.value),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(() => {
      return `left:${position.value.x}px;top:${position.value.y}px`
    })
  }
}
