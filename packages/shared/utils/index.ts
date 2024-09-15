import { getCurrentInstance } from 'vue'

export * from './types'
export * from './is'
export * from './compatibility'
export * from './filters'

export function promiseTimeout(ms: number, throwOnTimeout: boolean = false, reason = 'Timeout' ): Promise<void> {
  return new Promise((resolve, reject) => {
    if ( throwOnTimeout ) {
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

/**
 * 创建一个单例
 * @param fn 
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
  let _promise: Promise<T> | undefined
  function wrapper() {
    if ( !_promise )
      _promise = fn()

    return _promise
  }


  wrapper.reset = () => {
    _promise = undefined
  }

  return wrapper
}
