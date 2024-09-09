import { unref } from "vue";
import { AnyFn, MaybeRefOrGetter } from '../utils/types'

export function toValue<T>(r: MaybeRefOrGetter<T>) {
  return typeof r === 'function' ? (r as AnyFn)() : unref(r)
}
