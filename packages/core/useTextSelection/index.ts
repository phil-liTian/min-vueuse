import { computed, ref } from 'vue'
import { ConfigableWindow, defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

function getRangesFromSelection(selection: Selection) {
  const rangeCount = selection.rangeCount ?? 0

  return Array.from({ length: rangeCount }, (_, i) => {
    return selection.getRangeAt(i)
  })
}

export function useTextSelection(options: ConfigableWindow = {}) {
  const { window = defaultWindow } = options
  const selection = ref<Selection | null>(null)
  const text = computed(() => selection.value?.toString() ?? '')
  const rects = computed(() => ranges.value.map((range) => range.getBoundingClientRect()))
  const ranges = computed(() => {
    return selection.value ? getRangesFromSelection(selection.value) : []
  })

  const onSelectionChange = () => {
    selection.value = null
    if (window) {
      selection.value = window.getSelection()
    }
  }

  if (window) {
    useEventListener(window.document, 'selectionchange', onSelectionChange)
  }

  return {
    text,
    ranges,
    selection,
    rects
  }
}
