import { Ref, WatchOptions } from "vue";
import { ConfigableEventFilter, pausableFilter } from "@mini-vueuse/shared/utils/filters";
import { UseMannualRefHistoryOptions, UseMannualRefHistoryReturn, useMannualRefHistory } from "../useManualRefHistory";
import { Fn, watchIgnorable } from '@mini-vueuse/shared'

export interface UseRefHistoryReturn<Raw, Serialized> extends UseMannualRefHistoryReturn<Raw, Serialized> {
  isTracking: Ref<boolean>,

  batch: (fn: (cancel: Fn) => void) => void;

  pause: () => void;

  resume: (commit?: boolean) => void;

  dispose: () => void;
}

export interface UseRefHistoryOptions<Raw, Serialized> extends UseMannualRefHistoryOptions<Raw, Serialized>, ConfigableEventFilter, WatchOptions {
  // 容量
  capacity?: number;

  deep?: boolean

  // flush?: "pre" | "sync" | "post"
}

export function useRefHistory<Raw, Serialized = Raw>(source: Ref<Raw>, options: UseRefHistoryOptions<Raw, Serialized> = {}): UseRefHistoryReturn<Raw, Serialized> {

  const { flush = 'pre', deep = false, eventFilter } = options

  const {
    isActive: isTracking,
    pause, 
    resume: resumeTracking,
    eventFilter: composedFilter
  } = pausableFilter(eventFilter)
  
  const mannualHistory = useMannualRefHistory(source, { ...options, clone: options.clone || deep })

  const { commit: mannualCommit, clear } = mannualHistory

  const { 
    ignoreUpdates, 
    ignorePrevAsyncUpdates, 
    stop } = watchIgnorable(source, commit, { flush, deep, eventFilter: composedFilter })

  function commit() {
    // no op when flush is sync
    ignorePrevAsyncUpdates()

    mannualCommit()
  }

  // 批量处理, fn 中执行的操作, 只会触发一次watch
  function batch(fn: (cancel: Fn) => void) {
    let canceled = false    

    const cancel = () => canceled = true

    // 在ignoreUpdates里面的fn执行更新操作, 是不会触发watch监听的
    ignoreUpdates(() => {
      fn(cancel)
    })

    // 如果没有被cancel掉 则手动触发一次
    if ( !canceled )
      commit()

  }

  function resume(commitNow?: boolean) {
    resumeTracking()
    if ( commitNow )
      commit()
  }

  function dispose() {
    stop()
    clear()
  }

  return {
    ...mannualHistory,
    isTracking,
    commit,
    batch,
    dispose,
    pause,
    resume
  }
}
