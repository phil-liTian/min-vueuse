import type { WatchSource, WatchOptions, WatchCallback } from 'vue'
import { nextTick, watch } from 'vue'

export function whenever<T>(source: WatchSource<null | undefined | T | false>, cb: WatchCallback<T>, options?: WatchOptions<T>) {
  const stop = watch(source, (v, ov, onCleanup) => {
    if (v) {
      // 当v为true 如果设置once，则监听一次后停止watch; 与vue中watch不同, vue中不管watch中source是否为true,监听一次后都会清除当前watch
      if ( options?.once ) {
        nextTick(() => stop())
      }
      cb(v, ov, onCleanup)
    }
  }, {
    ...options,
    once: false
  } as WatchOptions)
}
