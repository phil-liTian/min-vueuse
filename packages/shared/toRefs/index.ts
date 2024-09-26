import { toRefs as _toRefs, customRef, isRef } from 'vue'
import { MaybeRef, MaybeRefOrGetter } from '../utils'
export interface ToRefsOptions {
  replaceRef?: MaybeRefOrGetter<boolean>
}

export function toRefs<T extends object>(objectRef: MaybeRef<T>, options: ToRefsOptions = {}) {
  if (!isRef(objectRef)) return _toRefs(objectRef)

  const result: any = {}

  for (const key in objectRef.value) {
    result[key] = customRef((track, trigger) => ({
      get() {
        return objectRef.value[key]
      },
      set(val) {
        const replaceRef = options?.replaceRef ?? true
        if (replaceRef) {
          if (Array.isArray(objectRef.value)) {
            let newObjectRef: any = [...objectRef.value]
            newObjectRef[key] = val
            objectRef.value = newObjectRef
          } else {
            const newObjectRef = { ...objectRef.value, [key]: val }
            objectRef.value = newObjectRef
          }
        } else {
          objectRef.value[key] = val
        }
      }
    }))
  }

  return result
}
