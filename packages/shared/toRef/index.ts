import { ComputedRef, customRef, readonly, ref, Ref, ToRef, toRef as valueToRef } from 'vue'
import { noop } from '../utils'

export function toRef<T>(r: T): Ref<T>
export function toRef<T>(r: ComputedRef<T>): ComputedRef<T>
export function toRef<T extends object, K extends keyof T>(object: T, key: K): ToRef<T[K]>
export function toRef<T extends object, K extends keyof T>(object: T, key: K, defaultValue: T[K]): ToRef<T[K]>
export function toRef(...args: any[]) {
  if (args.length !== 1) return valueToRef(...(args as [any, any]))

  const r = args[0]
  return typeof r === 'function' ? readonly(customRef(() => ({ get: r, set: noop }))) : ref(r)
}
