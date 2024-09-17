import { Ref, ref } from "vue"
import { useEventListener, WindowEventName } from "../useEventListener";
import { ConfigableWindow, defaultWindow } from "../_configurable";
import { ConfigableEventFilter, createFilterWrapper, throttleFilter, timestamp } from "@mini-vueuse/shared";

const oneMinute = 60_000

const defaultEvents: WindowEventName[] = [
  'mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'
]

export interface UseIdleOptions extends ConfigableWindow, ConfigableEventFilter {
  initialState?: boolean;
  events?: WindowEventName[];
  listenVisibilityChange?: boolean;
}

export interface UseIdleReturn {
  idle: Ref<boolean>;
  reset: () => void
}

export function useIdle(
  timeout: number = oneMinute, 
  options: UseIdleOptions = {}
) {
  const { 
    initialState = false,
    events = defaultEvents,
    window  = defaultWindow,
    listenVisibilityChange = true,
    eventFilter = throttleFilter(50)
  } = options

  // 是否处于非活动状态, true为非活动状态 false为活动状态
  const idle = ref(initialState)
  const lastActive = ref(timestamp())
  let timer: any

  function reset() {
    idle.value = false
    timer && clearTimeout(timer)
    timer = setTimeout(() => idle.value = true, timeout);
  }

  const onEvent = createFilterWrapper(
    eventFilter, 
    () => {
      lastActive.value = timestamp()
      reset()
    }
  )

  if ( window ) {
    const document = window.document
    for( const event of events) {
      useEventListener(document, event, onEvent)
    }

    if ( listenVisibilityChange ) {
      useEventListener(document, 'visibilitychange', () => {
        if ( !document.hidden ) {
          onEvent()
        }
      })
    }

    reset()
  }

  return {
    idle,
    lastActive,
    reset
  }
}
