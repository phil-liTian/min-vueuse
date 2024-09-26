import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { syncRef } from '.'

describe('syncRef', () => {
  it('should work', () => {
    const a = ref('foo')
    const b = ref('bar')
    const stop = syncRef(a, b)
    expect(b.value).toBe('foo')

    a.value = 'new-bar'
    expect(a.value).toBe('new-bar')
    expect(b.value).toBe('new-bar')

    b.value = 'new-foo'
    expect(a.value).toBe('new-foo')
    expect(b.value).toBe('new-foo')

    stop()

    a.value = 'new-foo1'
    expect(b.value).toBe('new-foo')
    expect(a.value).toBe('new-foo1')
  })

  it('ltr', () => {
    const a = ref('foo')
    const b = ref('bar')

    syncRef(a, b, { direction: 'ltr' })
    expect(b.value).toBe('foo')
    a.value = 'new-foo'
    expect(b.value).toBe('new-foo')

    b.value = 'new-bar'
    expect(a.value).toBe('new-foo')
  })

  it('custom transform', () => {
    const left = ref(2)
    const right = ref(1)

    const stop = syncRef(left, right, {
      transform: {
        ltr: (v) => v * 2,
        rtl: (v) => v / 2
      }
    })

    left.value = 4
    expect(right.value).toBe(8)

    right.value = 18
    expect(left.value).toBe(9)
    expect(right.value).toBe(18)

    stop()

    right.value = 10
    expect(left.value).toBe(9)
  })
})
