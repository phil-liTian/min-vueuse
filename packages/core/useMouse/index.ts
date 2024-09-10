import { ref } from 'vue'
import { Position } from '../types'
import { MaybeRefOrGetter } from '@mini-vueuse/shared';
import { useEventListener } from '@mini-vueuse/core'
export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement'
// type可自定义想要获取的x和y的值
export type UseMouseEventExtractor = () => [x: number, y: number] | undefined | null
export type UseMouseSourceType = 'mouse' | 'touch' | null
export interface UseMouseOptions {
  type?: UseMouseCoordType | UseMouseEventExtractor;

  initialValue?: Position;

  target?: MaybeRefOrGetter<Window | undefined | null | EventTarget>;

  // 触摸是否触发
  touch?: boolean;

  // 触摸结束后重置x,y
  resetOnTouchEnds?: boolean;
}

const UseMouseBuiltinExtractors = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) => event instanceof Touch ? null : [event.movementX, event.movementY]
}

export function useMouse(options: UseMouseOptions = {}) {
  const {
    type = 'page',
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    target = window
  } = options
  const sourceType = ref<UseMouseSourceType>(null)
  let x = ref(initialValue.x);
  let y = ref(initialValue.y);

  const extractor = typeof type === 'function' ? type : UseMouseBuiltinExtractors[type]

  function reset() {
    x.value = initialValue.x
    y.value = initialValue.y
  }

  // 鼠标事件
  const mouseHandler = (e: MouseEvent) => {
    const result = extractor(e)
    
    if ( result ) {
      [x.value, y.value] = result
      sourceType.value = 'mouse'
    }
  }

  // 触摸事件
  const touchHandler = (e: TouchEvent) => {
    if ( e.touches.length > 0 ) {
      const result = extractor(e.touches[0])
      if( result )  {
        [x.value, y.value] = result
        sourceType.value = 'touch'
      }
    }
  }

  const mouseHandlerWrapper = (e: MouseEvent) => {
    return mouseHandler(e)
  }

  const touchHandlerWrapper = (e: TouchEvent) => {
    return touchHandler(e)
  }

  if ( target ) {
    const listenerOptions = { passive: true }
    useEventListener(target, 'mousemove', mouseHandlerWrapper, listenerOptions)

    if ( touch && type !== 'movement' ) {
      useEventListener(target, ['touchmove', 'touchstart'], touchHandlerWrapper, listenerOptions)
      if ( resetOnTouchEnds ) {
        useEventListener(target, 'touchend', reset)
      }
    }

    if ( type === 'page' ) {

    }
  }
  

  return {
    x,
    y,
    sourceType
  }
}
