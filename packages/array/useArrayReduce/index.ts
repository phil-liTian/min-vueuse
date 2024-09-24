import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { computed, ComputedRef } from 'vue'

export type UseArrayReducer<PV, CV, R> = (preValue: PV, curValue: CV, index: number) => R

export function useArrayReduce<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: UseArrayReducer<T, T, T>
): ComputedRef<T>

export function useArrayReduce<T, U>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: UseArrayReducer<U, T, U>,
  initialValue: MaybeRefOrGetter<U> // 可以是任意数据类型
): ComputedRef<U>

export function useArrayReduce<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  reducer: (...p: any[]) => any,
  ...args: any[]
) {
  const reduceCallback = (pre: any, cur: any, index: number) => reducer(toValue(pre), toValue(cur), index)
  return computed(() => {
    const resolved = toValue(list)

    return args.length ? resolved.reduce(reduceCallback, args[0]) : resolved.reduce(reduceCallback)
  })
}
