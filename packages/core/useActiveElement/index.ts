import { ref } from 'vue'
import { ConfigableDocumentOrShadowRoot, ConfigableWindow, defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseActiveElementOptions extends ConfigableWindow, ConfigableDocumentOrShadowRoot {
  deep?: boolean

  triggerOnRemoval?: boolean
}

export function useActiveElement<T extends HTMLElement>(options: UseActiveElementOptions = {}) {
  const { window = defaultWindow, deep = true, triggerOnRemoval = false } = options
  const document = options.document ?? window?.document
  const activeElement = ref<T | null | undefined>(null)

  const getDeepActiveElement = () => {
    let element = document?.activeElement
    // if (deep)
    //   while (element && element.shadowRoot && element.shadowRoot.activeElement)
    //     element = element.shadowRoot.activeElement

    return element
  }

  const trigger = () => {
    activeElement.value = getDeepActiveElement()
  }

  if (window) {
    useEventListener(window, 'focus', trigger, true)
    useEventListener(
      window,
      'blur',
      (event) => {
        trigger()
      },
      true
    )
  }

  // TODO 元素被移除的时候, 更新activeElement, 需要监听元素被移除的事件
  if (triggerOnRemoval) {
    trigger()
  }

  trigger()

  return activeElement
}
