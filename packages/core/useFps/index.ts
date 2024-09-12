import { ref } from "vue";
import { useRafFn } from "../useRafFn";

export interface UseFpsOptions {
  // 计算帧率的频率
  every?: number
}

export function useFps(options: UseFpsOptions = {}) {
  const fps = ref(0)

  const {
    every
  } = options

  if ( typeof performance === 'undefined' )
    return fps

  // 获取到的是从页面加载开始到当前时间的高精度时间戳，单位为毫秒
  // 1. 高精度 精确到微秒级
  // 2. 返回的是页面加载时间
  let last = performance.now()
  let tick = 0
  const _every = every ?? 10

  useRafFn(() => {
    tick++
    if ( tick >= _every ) {
      const now = performance.now()
      const diff = now - last
      fps.value = Math.round(1000 / (diff / _every))
      tick = 0
      last = now
    }
  })

  return fps
}
