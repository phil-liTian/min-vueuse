import { computed, watch } from 'vue'
import { ConfigableWindow, defaultWindow } from '../_configurable'
import { MaybeComputedElementRef, MaybeElement, unRefElement } from '../unrefElement'
import useSupported from '../useSupported'
import { MaybeRefOrGetter, notNullish, toValue } from '@mini-vueuse/shared'

export interface UseMutationObserverOptions extends ConfigableWindow, MutationObserverInit {}

export function useMutationObserver(
  target: MaybeComputedElementRef | MaybeComputedElementRef[] | MaybeRefOrGetter<MaybeElement[]>,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {}
) {
  const { window = defaultWindow } = options
  let observer: MutationObserver | undefined
  const isSupported = useSupported(() => window && 'MutationObserver' in window)

  const targets = computed(() => {
    const value = toValue(target)
    const items = (Array.isArray(value) ? value : [value]).map(unRefElement).filter(notNullish)
    return new Set(items)
  })

  const stopWatch = watch(
    () => targets.value,
    (targets) => {
      if (isSupported.value && targets.size) {
        // 实时监测 DOM 变化 包括元素属性修改、节点内容修改、节点添加和删除
        // 高效的异步监测 非阻塞执行 批量处理变化
        observer = new MutationObserver(callback)
        targets.forEach((el) => observer?.observe(el, options))
      }
    },
    { immediate: true }
  )

  function cleanup() {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const takeRecords = () => {
    if (observer) return observer.takeRecords()
  }

  function stop() {
    stopWatch()
    cleanup()
  }

  return {
    isSupported,
    stop,
    takeRecords
  }
}
