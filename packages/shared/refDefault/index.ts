import { computed, Ref } from 'vue'

export function refDefault<T>(source: Ref<T>, defaultValue: T): Ref<T> {
  return computed({
    get() {
      return source.value || defaultValue
    },
    set(value) {
      source.value = value
    }
  })
}
