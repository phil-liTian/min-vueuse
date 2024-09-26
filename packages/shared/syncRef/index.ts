import { Ref } from 'vue'
import { ConfigurableFlush } from '../utils'
import { WatchPausable, watchPausable, WatchPausableReturn } from '../watchPausable'

export type Direction = 'ltr' | 'rtl' | 'both'
export interface SyncRefOptions extends ConfigurableFlush {
  direction?: Direction
  deep?: boolean
  immediate?: boolean
  transform?: any
}

export function syncRef<L, R>(left: Ref<L>, right: Ref<R>, options: SyncRefOptions = {}) {
  const { flush = 'sync', direction = 'both', immediate = true, transform = {} } = options

  let watchers: WatchPausableReturn[] = []
  const transformLTR = ('ltr' in transform && transform.ltr) || ((v) => v)
  const transformRTL = ('rtl' in transform && transform.rtl) || ((v) => v)

  if (direction === 'both' || direction === 'ltr') {
    watchers.push(
      watchPausable(
        left,
        (value) => {
          right.value = transformLTR(value)
        },
        { immediate, flush }
      )
    )
  }

  if (direction === 'both' || direction === 'rtl') {
    watchers.push(
      watchPausable(
        right,
        (value) => {
          left.value = transformRTL(value)
        },
        { immediate, flush }
      )
    )
  }

  const stop = () => {
    watchers.forEach((watcher) => watcher.stop())
  }

  return stop
}
