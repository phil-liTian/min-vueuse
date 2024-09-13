import { Ref, ref, watch } from "vue";
import { DebounceFilterOptions, MaybeRefOrGetter } from "../utils";
import { useDebounceFn } from "@mini-vueuse/shared";

export function refDebounce<T>(value: Ref<T>, ms: MaybeRefOrGetter<number> = 200, options: DebounceFilterOptions = {}): Ref<T> {
  const debounced = ref(value.value as T) as Ref<T>

  const updater = useDebounceFn(() => {
    debounced.value = value.value
  }, ms, options)

  watch(value, () => updater())

  return debounced
}