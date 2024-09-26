import { isRef, reactive, UnwrapNestedRefs } from 'vue'
import { MaybeRef } from '../utils'

export function toReactive<T extends object>(objectRef: MaybeRef<T>) {
  if (!isRef(objectRef)) {
    return reactive(objectRef)
  }

  const proxy = new Proxy(
    {},
    {
      get(_, p, receiver) {
        return Reflect.get(objectRef.value, p, receiver)
      },
      set(_, p, value) {
        if (isRef(value)) {
          return Reflect.set(objectRef.value, p, value.value)
        }
        return Reflect.set(objectRef.value, p, value)
      },
      deleteProperty(_, p) {
        return Reflect.deleteProperty(objectRef.value, p)
      },
      has(_, p) {
        return Reflect.has(objectRef.value, p)
      },
      ownKeys() {
        return Reflect.ownKeys(objectRef.value)
      },

      getOwnPropertyDescriptor() {
        return {
          enumerable: true,
          configurable: true
        }
      }
    }
  )

  return reactive(proxy) as UnwrapNestedRefs<T>
}
