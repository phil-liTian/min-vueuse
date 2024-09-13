import { ref } from "vue"
import { AnyFn, ArgumentsType, MaybeRefOrGetter } from "./types"
import { toValue } from "../toValue"
import { noop } from "./is"

export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return

export interface DebounceFilterOptions {
  // 最大等待时间
  maxWait?: MaybeRefOrGetter<number>;

  rejectOnCancel?: boolean
}

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>,
  args: Args,
  thisArg: This
}

type EventFilter<Args extends any[] = any[], This = any, Invoke extends AnyFn = AnyFn> = (
  invoke: Invoke,
  options: FunctionWrapperOptions<Args, This>
) => ReturnType<Invoke>

export const byPassFilter: EventFilter = (invoke) => invoke()

export interface ConfigableEventFilter {
  eventFilter?: EventFilter
}

// 如何实现的可中断、可恢复？？？
export function pausableFilter(extendFilter: EventFilter = byPassFilter) {
  const isActive = ref(true)

  function pause() {
    isActive.value = false
  }

  function resume() {
    isActive.value = true
  }

  const eventFilter: EventFilter = (...args) => {
    if ( isActive.value )
      extendFilter(...args)

    // 返回空
  }

  return { resume, pause, isActive, eventFilter }
}


// 用filter函数决定fn是否执行
export function createFilterWrapper<T extends AnyFn>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: ArgumentsType<T>) {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      // make sure it's a promise
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
        .then(resolve)
        .catch(reject)
    })
  }

  return wrapper
}


export function debounceFilter(ms: MaybeRefOrGetter<number>, options: DebounceFilterOptions = {} ) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let maxTimer: ReturnType<typeof setTimeout> | undefined | null
  let lastRejector: AnyFn = noop

  const filter: EventFilter = (invoke) => {
    const duration = toValue(ms)
    const maxDuration = toValue(options.maxWait)

    // key: 如果在这期间频繁触发, 如果之前还存在timer, 则此时的延时任务会被清空掉, 不再执行
    if ( timer ) {
      _clearTimeout(timer)
    }
    
    function _clearTimeout(timer?: ReturnType<typeof setTimeout>) {
      clearTimeout(timer)
      lastRejector()
      lastRejector = noop
    }

    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : noop
      if ( maxDuration && !maxTimer ) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer)
          maxTimer = null
          resolve(invoke())
        }, maxDuration);
      }


      timer = setTimeout(() => {
        if ( maxTimer ) {
          _clearTimeout(maxTimer)
        }
        maxTimer = null
        resolve(invoke())
      }, duration);
    })
  }

  return filter
}
