import { Ref, watch, WatchSource } from 'vue'
import { ConfigurableFlush } from '../utils'

export interface SyncRefsOptions extends ConfigurableFlush {
  immediate?: boolean
  deep?: boolean
}
export function syncRefs<T>(source: WatchSource<T>, target: Ref<T> | Ref<T>[], options: SyncRefsOptions = {}) {
  if (!Array.isArray(target)) {
    target = [target]
  }
  const { immediate = true, deep = true, flush = 'sync' } = options

  return watch(source, (newValue) => target.forEach((t) => (t.value = newValue)), { immediate, deep, flush })
}
