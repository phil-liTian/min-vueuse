import { ref, watch, WatchStopHandle } from "vue"
import { WatchWithFilterOptions } from "../watchWithFilter"
import { Fn } from "../utils"
import { byPassFilter, createFilterWrapper } from "../utils/filters"

export type IgnoreUpdater = (updater: () => void) => void

export type WatchIgnorableReturn = {
  ignoreUpdates: IgnoreUpdater;
  ignorePrevAsyncUpdates: () => void;
  stop: WatchStopHandle
}

export function watchIgnorable<Immediate extends Readonly<boolean> = false>(source: any, cb: any, options: WatchWithFilterOptions<Immediate> = {}): WatchIgnorableReturn {

  const { eventFilter = byPassFilter, ...watchOptions } = options

  const filteredCb = createFilterWrapper(
    eventFilter,
    cb
  )

  let stop: () => void
  let ignoreUpdates: IgnoreUpdater
  let ignorePrevAsyncUpdates: () => void

  if ( watchOptions.flush === 'sync' ) {
    // 同步执行回调函数 回调函数会在触发依赖变化时立即执行，而不会等待下一个微任务队列或 DOM 更新周期
    let ignore = ref(false)
    // no op for flush:sync
    ignorePrevAsyncUpdates = () => {}

    ignoreUpdates = (updater: () => void) => {
      ignore.value = true
      updater()
      ignore.value = false
    }

    stop = watch(source, (...args) => {
      if ( !ignore.value ) {
        filteredCb(...args)
      }
    }, watchOptions)

  } else {
    // pre or post
    const ignoreCounter = ref(0)
    const syncCounter = ref(0)

    let disposables: Fn[] = []

    ignorePrevAsyncUpdates = () => {
      ignoreCounter.value = syncCounter.value
    }

    disposables.push(
      watch(source, () => {
        syncCounter.value++
      }, { ...watchOptions, flush: 'sync' })
    )

    ignoreUpdates = (updater: () => void) => {
      const syncCounterPrev = syncCounter.value
      // 如果update没有改变syncCounter 也就是没有触发trigger的时候, ignoreCounter为0, 可能不能等于syncCounte 则需要执行cb
      updater()
      ignoreCounter.value += syncCounter.value - syncCounterPrev
    }

    disposables.push(
      watch(source, (...args) => {
        const ignore = ignoreCounter.value > 0 && ignoreCounter.value === syncCounter.value
        syncCounter.value = 0
        ignoreCounter.value = 0
        if ( ignore ) return
        filteredCb(...args)
      }, { ...watchOptions })
    )

    stop = () => disposables.map(fn => fn())
  }

  return {
    ignorePrevAsyncUpdates,
    ignoreUpdates,
    stop,
  }
}