import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";

export function useArrayJoin(list: MaybeRefOrGetter<MaybeRefOrGetter<any>[]>, separator?: MaybeRefOrGetter<string> ): ComputedRef<string> {
  return computed(() => toValue(list).map(i => toValue(i)).join(toValue(separator)))
}