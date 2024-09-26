import { describe, expect, it } from 'vitest'
import { isReactive, nextTick, reactive, ref, toRefs, watchSyncEffect } from 'vue'
import { toReactive } from '.'

describe('toReactive', () => {
  it('should work', () => {
    const r = ref({ a: 'a', b: 0 })
    const state = toReactive(r)
    expect(state?.a).toBe('a')
    r.value.a = 'b'
    expect(state?.a).toBe('b')
  })

  it('should be enumable', () => {
    const obj = { a: 'a', b: 0 }
    const r = ref(obj)
    const state = toReactive(r)
    expect(state.a).toBe('a')

    expect(JSON.stringify(state)).toBe(JSON.stringify(r.value))
    expect(state).toEqual(obj)
    expect(Object.keys(state)).toEqual(['a', 'b'])
  })

  it('should be reactive', () => {
    const r = ref({ a: 'a', b: 0 })
    const state = toReactive(r)
    expect(state.a).toBe('a')
    expect(state.b).toBe(0)

    expect(isReactive(state)).toBe(true)

    let dummy = 1
    watchSyncEffect(() => {
      dummy = state.b
    })

    expect(dummy).toBe(0)

    r.value.b++
    expect(dummy).toBe(1)
    console.log('state', state)

    state.b += 1
    expect(dummy).toBe(2)
  })

  it('should be replacable', async () => {
    const r = ref<any>({ a: 'a', b: 0 })
    const state = toReactive(r)
    let dummy = 0

    expect(state.a).toBe('a')
    expect(state.b).toBe(0)

    watchSyncEffect(() => {
      dummy = state.b
    })

    expect(dummy).toBe(0)

    r.value = { b: 1, a: 'a' }

    expect(dummy).toBe(1)

    state.b += 1

    await nextTick()

    expect(dummy).toBe(2)

    r.value = { a: 'c' }

    expect(dummy).toBe(undefined)
    expect(state).toEqual({ a: 'c' })
  })

  it('toReactive(toRefs())', () => {
    const a = reactive({ a: 'a', b: 0 })
    const b = toRefs(a)
    const c = toReactive(b)

    expect(a).toEqual(c)

    a.b = 1

    expect(c.b).toEqual(1)
  })
})
