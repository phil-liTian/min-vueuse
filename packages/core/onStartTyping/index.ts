import { ConfigableDocument, defaultDocument } from '../_configurable'
import { useEventListener } from '../useEventListener'

function isTypedCharValid(event: KeyboardEvent): boolean {
  const { altKey, ctrlKey, metaKey, shiftKey, keyCode } = event
  if (altKey || ctrlKey || metaKey || shiftKey) return false

  // 0 - 9
  if (keyCode >= 49 && keyCode <= 57) {
    return true
  }

  // a - z
  if (keyCode >= 65 && keyCode <= 90) {
    return true
  }

  // A-Z
  if (keyCode >= 97 && keyCode <= 122) {
    return true
  }

  return false
}

function isFocusedElementEditable() {
  const { activeElement, body } = document

  if (!activeElement) return false

  if (activeElement === body) return false

  if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) return true

  return activeElement.hasAttribute('contenteditable')
}

export function onStartTyping(callback: (event: KeyboardEvent) => void, options: ConfigableDocument = {}) {
  const { document = defaultDocument } = options

  const keydown = (event: KeyboardEvent) => {
    // 1.必须是可编辑元素
    // 2. 特殊字符不算
    if (isTypedCharValid(event) && !isFocusedElementEditable()) {
      callback(event)
    }
  }

  if (document) {
    useEventListener(document, 'keydown', keydown, { passive: true })
  }
}
