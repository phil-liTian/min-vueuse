import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";

export function useArrayFindLast<T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => boolean): ComputedRef<T | undefined> {

  return computed(() => toValue(toValue(list).findLast((element, index, array) => fn(toValue(element), index, array))))
}
