
export function nextTwoTick() {
  return new Promise(resolve => {
    setTimeout(() => setTimeout(resolve))
  })
}