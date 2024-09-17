import { ref } from "vue";
import { ConfigableWindow, defaultWindow } from "../_configurable";
import { useEventListener } from "../useEventListener";

export function usePageLeave(options: ConfigableWindow = {}) {
  const { window = defaultWindow } = options
  const isLeft = ref(false)

  const handler = (event: MouseEvent) => {
    if (!window)
      return
    event = event || window.event
    // @ts-ignore
    const from = event.relatedTarget || event.toElement
    isLeft.value = !from
  }

  if ( window ) {
    useEventListener(window, 'mouseout', handler, { passive: true })
    useEventListener(window.document, 'mouseleave', handler, { passive: true })
    useEventListener(window.document, 'mouseenter', handler, { passive: true })
  }

  return isLeft
}
