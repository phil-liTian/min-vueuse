import { getCurrentInstance } from 'vue'

export * from './types'
export * from './is'
export * from './compatibility'
export * from './filters'

export function promiseTimeout(ms: number, throwOnTimeout: boolean = false, reason = 'Timeout'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout) {
      setTimeout(() => reject(reason), ms)
    } else {
      setTimeout(resolve, ms)
    }
  })
}

export function getLifeCycleTarget(target?: any) {
  return target || getCurrentInstance()
}

export interface SingletonPromiseReturn<T> {
  (): Promise<T>
  reset: () => void
}

export function identity<T>(args: T): T {
  return args
}

/**
 * 创建一个单例
 * @param fn
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
  let _promise: Promise<T> | undefined
  function wrapper() {
    if (!_promise) _promise = fn()

    return _promise
  }

  wrapper.reset = () => {
    _promise = undefined
  }

  return wrapper
}

// 对象中包含属性
export function containsProp(obj: Object, ...props: string[]) {
  return props.some((p) => p in obj)
}

// 筛选中obj中key在keys中的属性 返回一个新对象
export function objectOmit<O extends Object, K extends keyof O>(obj: O, keys: K[], omitUndefined = false) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      return keys.includes(key as K) && (!omitUndefined || value !== undefined)
    })
  )
}
