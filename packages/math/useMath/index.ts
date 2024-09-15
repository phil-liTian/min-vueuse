export function useMath<K extends keyof Math>(key: K, ...args: any[]) {

  return (Math[key] as any)(...args)
}