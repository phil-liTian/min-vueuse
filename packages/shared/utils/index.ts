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