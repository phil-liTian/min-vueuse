import { describe, it, expect } from 'vitest'
import { useFloor } from './index'
import { ref } from 'vue'


describe('useMax', () => {
  it('should be defined', () => {
    expect(useFloor).toBeDefined()
  })

  it('should work', () => {
    const base = ref(1.95)
    const result = useFloor(base)
    expect(result.value).toBe(1)

    base.value = -7.004
    expect(result.value).toBe(-8)
  })
})

