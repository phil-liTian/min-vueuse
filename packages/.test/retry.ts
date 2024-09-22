// 自动重试 默认1ms重试一次, 100ms则不再重试，抛出异常
export function retry(assertion: Function, { interval = 1, timeout = 100 }) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const tryAgain = () => {
      setTimeout(() => {
        try {
          resolve(assertion())
        } catch (err) {
          if (Date.now() - startTime > timeout) {
            reject(err)
          } else {
            tryAgain()
          }
        }
      }, interval)
    }

    tryAgain()
  })
}
