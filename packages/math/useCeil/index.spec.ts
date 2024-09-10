import { describe, it, expect } from 'vitest'
import { useCeil } from './index'
import { ref } from 'vue'


describe('useMax', () => {
  it('should be defined', () => {
    expect(useCeil).toBeDefined()
  })

  it('should work', () => {
    const base = ref(1.95)
    const result = useCeil(base)
    expect(result.value).toBe(2)

    base.value = -7.004
    expect(result.value).toBe(-7)
  })
})

