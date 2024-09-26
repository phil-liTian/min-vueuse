import { describe, expect, it, vi } from 'vitest'
import { computed, reactive } from 'vue'
import { toRefs } from './index'

describe('toRefs', () => {
  it('should work', () => {
    const obj = reactive({ foo: 1, a: 'a' })
    const objRefs = toRefs(obj)
    expect(objRefs.foo.value).toBe(1)
    expect(objRefs.a.value).toBe('a')

    obj.foo = 2
    obj.a = 'b'
    expect(objRefs.foo.value).toBe(2)
  })

  it('should work with array reactive', () => {
    const arr = reactive([1, 2, 3])
    const arrRefs = toRefs(arr)
    expect(arrRefs[0].value).toBe(1)

    arr[0] = 99
    expect(arrRefs[0].value).toBe(99)
  })

  it('should work with writable computed', () => {
    const spy = vi.fn()
    const obj = computed<{ a: string; b: number }>({
      get() {
        return { a: 'a', b: 1 }
      },
      set(val) {
        spy(val)
      }
    })

    const refs = toRefs(obj)
    expect(refs.a.value).toBe('a')
    expect(refs.b.value).toBe(1)

    refs.a.value = 'b'
    expect(spy).toHaveBeenLastCalledWith({ a: 'b', b: 1 })
  })

  it('should work with array computed', () => {
    const spy = vi.fn()
    const obj = computed<any[]>({
      get() {
        return ['a', 1]
      },
      set(val) {
        spy(val)
      }
    })

    const refs = toRefs(obj)
    expect(refs[0].value).toBe('a')
    expect(refs[1].value).toBe(1)

    refs[0].value = 'b'
    expect(spy).toHaveBeenLastCalledWith(['b', 1])
  })
})
