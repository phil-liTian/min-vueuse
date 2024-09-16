import { AnyFn, Fn, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef, unref } from "vue";

// TODO
export type ReactifyReturn<T, Computed extends boolean> = (...args) => ComputedRef<T>

export interface ReactifyOptions<T extends boolean> {
  computtedGetter?: T
}

/**
 * 返回处理后的函数 每个参数都可以传ref类型数据
 * @param fn 
 * @param options 
 * @returns 
 */

export function reactify<T extends AnyFn, K extends boolean = true>(fn: T, options: ReactifyOptions<K> = {}): ReactifyReturn<T, K> {
  const unrefFn = options.computtedGetter === false ? unref : toValue
  return function(this: any, ...args: any[]) {
    return computed(() => fn.apply(this, args.map(i => unrefFn(i))))
  } as any
}