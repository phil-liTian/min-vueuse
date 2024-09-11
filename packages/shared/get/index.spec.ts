import { describe, expect, it } from "vitest";
import { reactive, ref } from "vue";
import { get } from "./indext";

describe('get', () => {
  it('unref', () => {
    const a = ref(42)
    expect(get(a)).toBe(42)
    expect(get(42)).toBe(42)
  })

  it( 'ref object', () => {
    const reactive = ref({ foo: 'bar' })
    const plain = { foo: 'bar' }
    expect(get(reactive, 'foo')).toBe('bar')
    expect(get(plain, 'foo')).toBe('bar')

    // @ts-expect-error
    expect(get(reactive, 'bar')).toBeUndefined()
  })

  it ('ref array', () => {
    const arr = ref([1, 2, 3])
    const plainArr = [1, 2, 3]
    expect(get(arr, 1)).toBe(2)
    expect(get(plainArr, 1)).toBe(2)
  })
})