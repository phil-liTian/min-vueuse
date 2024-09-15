import { MaybeRefOrGetter, ReadonlyRefOrGetter, toValue } from "@mini-vueuse/shared";
import { clamp } from '@mini-vueuse/shared'
import { computed, ComputedRef, isReadonly, Ref, ref } from "vue";

export function useClamp(value: ReadonlyRefOrGetter<number>, min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>) : ComputedRef<number>

export function useClamp(value: MaybeRefOrGetter<number>, min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>) : Ref<number>

export function useClamp(value: MaybeRefOrGetter<number>, min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>) {

  // no setter
  if ( typeof value === 'function' || isReadonly(value) ) {
    return computed(() => clamp(toValue(value), toValue(min), toValue(max)))
  }

  const _value = ref(value)
  return computed<number>({
    get() {
      return _value.value = clamp(_value.value, toValue(min), toValue(max))
    },
    set(value) {
      _value.value = clamp(value, toValue(min), toValue(max))
    },
  })

}