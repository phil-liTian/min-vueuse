import { isRef, Ref, ref, ShallowUnwrapRef } from 'vue'

export interface ExtendRefOptions<UnWrap extends boolean = boolean> {
  enumerable?: boolean
  unWrap?: UnWrap
}

export function extendRef<R extends Ref<any>, Extend extends object>(
  ref: R,
  extend: Extend,
  options?: ExtendRefOptions<true>
): Extend & R

export function extendRef<R extends Ref<any>, Extend extends object>(
  ref: R,
  extend: Extend,
  options?: ExtendRefOptions<false>
): ShallowUnwrapRef<Extend> & R

export function extendRef<R extends Ref<any>, Extend extends object>(
  ref: R,
  extend: Extend,
  options: ExtendRefOptions = {}
) {
  const { enumerable = false, unWrap = true } = options
  for (const [key, value] of Object.entries(extend)) {
    // 对象不可改变value的值
    if (key === 'value') continue

    if (isRef(value) && unWrap) {
      Object.defineProperty(ref, key, {
        get() {
          return value.value
        },
        set(v) {
          value.value = v
        },
        enumerable,
        configurable: true
      })
    } else {
      // Reflect.set(ref, key, { value, enumerable })
      Object.defineProperty(ref, key, { value, enumerable })
    }
  }

  return ref
}
