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

export interface ThrottleFilterOptions {
  trailing?: boolean;

  leading?: boolean
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

// 如何实现的可中断、可恢复
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

  function _clearTimeout(timer?: ReturnType<typeof setTimeout>) {
    clearTimeout(timer)
    lastRejector()
    lastRejector = noop
  }
  const filter: EventFilter = (invoke) => {
    const duration = toValue(ms)
    const maxDuration = toValue(options.maxWait)

    // key: 如果在这期间频繁触发, 如果之前还存在timer, 则此时的延时任务会被清空掉, 不再执行
    if ( timer ) {
      _clearTimeout(timer)
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


export function throttleFilter(ms: MaybeRefOrGetter<number>, options: ThrottleFilterOptions = {}) {

  let timer: ReturnType<typeof setTimeout> | undefined
  let lastExec = 0;
  let lastValue: any
  let isLeading = true

  let {
    trailing = false,
    leading = true
  } = options

  function _clear() {
    clearTimeout(timer)
    timer = undefined
  }

  /**
   * key: 记录上一次执行时间到现在执行时间间隔是否大于设置的duration, 大于则执行, 反之不执行
   * @param _invoke 
   */
  const filter: EventFilter = _invoke => {
    const duration = toValue(ms)
    // 经过时间
    const elapsed = Date.now() - lastExec

    const invoke = () => {
      lastExec = Date.now()
      return _invoke()
    }

    _clear()

    // 如果duration设置成小于等于0, 则立即执行
    if ( duration <= 0 ) {
      return invoke()
    }

    // 默认第一次点击是会执行的
    // 如果leading设置成false, 在duration内的第二次点击会执行
    if ( elapsed > duration && (leading || !isLeading) ) {
      invoke()
    } else if ( trailing ) {
      // 最后会调用一次
      new Promise((resolve, reject) => {

      })
    }

    // 第一次点击的时候不执行, 在duration之后的第一次调用也不会立即执行
    if ( !leading && !timer ) {
      timer = setTimeout(() => {
        isLeading = true
      }, duration);
    }

    isLeading = false
  }

  return filter
}

