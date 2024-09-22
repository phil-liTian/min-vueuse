import { ref } from 'vue'
import { ConfigableDocument, defaultDocument } from '../_configurable'
import { useEventListener, WindowEventName } from '../useEventListener'

export type KeyModifier = 'Alt' | 'Control' | 'NumLock' | 'Shift' | 'CapsLock'

const defaultEvents: WindowEventName[] = ['mousedown', 'mouseup', 'keyup', 'keydown']

export interface UseKeyModifierOptions extends ConfigableDocument {
  events?: WindowEventName[]
}

export function useKeyModifier(modifier: KeyModifier, options: UseKeyModifierOptions = {}) {
  const { document = defaultDocument, events = defaultEvents } = options
  const state = ref<boolean>(false)

  if (document) {
    useEventListener(document, events, (event: MouseEvent) => {
      if (typeof event.getModifierState === 'function') {
        state.value = event.getModifierState(modifier)
      }
    })
  }

  return state
}
