export * from './types'
export * from './is'
export * from './compatibility'

export function promiseTimeout(ms: number, throwOnTimeout: boolean = false, reason = 'Timeout' ): Promise<void> {
  return new Promise((resolve, reject) => {
    if ( throwOnTimeout ) {
      setTimeout(() => reject(reason), ms)
    } else {
      setTimeout(resolve, ms)
    }
  })
}