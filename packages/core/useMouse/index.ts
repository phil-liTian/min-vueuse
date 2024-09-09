import { ref } from 'vue'
import { Position } from '../types'
import { MaybeRefOrGetter } from '@mini-vueuse/shared';
import { useEventListener } from '@mini-vueuse/core'
export type UseMouseCoordType = 'page'
// type可自定义想要获取的x和y的值
export type UseMouseEventExtractor = () => [x: number, y: number] | undefined | null
export type UseMouseSourceType = 'mouse' | 'touch' | null
export interface UseMouseOptions {
  type?: UseMouseCoordType | UseMouseEventExtractor;

  initialValue?: Position;

  target?: MaybeRefOrGetter<Window | undefined>;
}

const UseMouseBuiltinExtractors = {
  page: (event: MouseEvent) => [event.pageX, event.pageY]
}

export function useMouse(options: UseMouseOptions = {}) {
  const {
    type = 'page',
    initialValue = { x: 0, y: 0 },
    target = window
  } = options
  const sourceType = ref<UseMouseSourceType>(null)
  let x = ref(initialValue.x);
  let y = ref(initialValue.y);

  const extractor = typeof type === 'function' ? type : UseMouseBuiltinExtractors[type]

  const mouseHandler = (e: MouseEvent) => {
    const result = extractor(e)
    
    if ( result ) {
      [x.value, y.value] = result
      sourceType.value = 'mouse'
    }
  }

  const mouseHandlerWrapper = (e: MouseEvent) => {
    return mouseHandler(e)
  }

  if ( target ) {
    const listenerOptions = { passive: true }
    useEventListener(target, 'mousemove', mouseHandlerWrapper, listenerOptions)

    if ( type === 'page' ) {

    }
  }
  


  return {
    x,
    y,
    sourceType
  }
}
