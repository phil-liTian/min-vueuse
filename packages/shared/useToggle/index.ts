import { isRef, Ref, ref } from 'vue'
import { MaybeRef, MaybeRefOrGetter } from '../utils/types'
import { toValue } from '../toValue'

export interface UseToggleOptions<Truthy, Falsy> {
  truthyValue?: MaybeRefOrGetter<Truthy>
  falsyValue?: MaybeRefOrGetter<Falsy>
}

// initialValue 是ref类型 则返回函数
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(
  initialValue: Ref<T>,
  options?: UseToggleOptions<Truthy, Falsy>
): (value?: T) => T

// 不是ref类型 返回数组
export function useToggle<Truthy = true, Falsy = false, T = Truthy | Falsy>(
  initialValue?: T,
  options?: UseToggleOptions<Truthy, Falsy>
): [Ref<T>, (value?: T) => T]

export function useToggle(initialValue: MaybeRef<boolean> = false, options: UseToggleOptions<true, false> = {}) {
  const { truthyValue = true, falsyValue = false } = options

  const valueIsRef = isRef(initialValue)
  const _value = ref(initialValue) as Ref<boolean>
  function toggle(value?: boolean) {
    console.log('value', value)

    // 因为value本身就是boolean类型的 可以使用arguments判断是否存在参数
    if (arguments.length) {
      // 非空断言
      _value.value = value!
    } else {
      const truhty = toValue(truthyValue)
      _value.value = _value.value === truhty ? toValue(falsyValue) : truhty
    }
    return _value.value
  }

  if (valueIsRef) {
    return toggle
  } else {
    return [_value, toggle] as any
  }
}
