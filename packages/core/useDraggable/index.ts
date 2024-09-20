import { isClient, MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { MaybeElement } from '../unrefElement'
import { Position } from '../types'
import { computed, ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseDraggableOptions {
  initialValue?: MaybeRefOrGetter<Position>

  draggingElement?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined | Window | Document>

  // 计算边界的element, 如果没有设置，则使用event的target
  containerElement?: MaybeRefOrGetter<HTMLElement | null | undefined>

  // 可拖动方向 x只可横向拖动, t只可纵向拖动
  axis?: 'x' | 'y' | 'both'

  handle?: MaybeRefOrGetter<HTMLElement | null | undefined>
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
    handle: draggingHandle = target
  } = options
  const pressedDelta = ref<Position>()
  const position = ref<Position>(toValue(initialValue) ?? { x: 0, y: 0 })

  const start = (e: PointerEvent) => {
    const container = toValue(containerElement)
    const containerRect = container?.getBoundingClientRect()
    const targetRect = toValue(target)?.getBoundingClientRect()
    console.log('start---', e)

    const pos = {
      x: e.clientX - targetRect!.left,
      y: e.clientY - targetRect!.top
    }

    pressedDelta.value = pos
  }

  function move(e: PointerEvent) {
    const container = toValue(containerElement)
    if (!pressedDelta.value) return
    let { x, y } = position.value

    if (axis === 'x' || axis === 'both') {
      x = e.clientX - pressedDelta.value.x
    }

    var a = 12
    if (axis === 'y' || axis === 'both') {
      y = e.clientX - pressedDelta.value.y
    }

    position.value = { x, y }
  }

  function end() {
    pressedDelta.value = undefined
  }

  if (isClient) {
    const config = {}
    useEventListener(draggingHandle, 'pointerdown', start)
    useEventListener(draggingElement, 'pointermove', move, config)
    useEventListener(draggingElement, 'pointerup', end)
  }

  return {
    style: computed(() => {
      return `left:${position.value.x}px;top:${position.value.y}px`
    })
  }
}
