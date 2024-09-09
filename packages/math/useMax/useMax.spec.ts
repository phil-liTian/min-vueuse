import { describe, it, expect } from 'vitest'
import { useMax } from './index'
import { ref } from 'vue'


describe('useMax', () => {
  it('should be defined', () => {
    expect(useMax).toBeDefined()
  })

  it('should accept numbers', () => { 
    const v = useMax(1, 2, 3)
    expect(v.value).toBe(3)
  })

  it('should accept refs', () => {
    const a = ref(10)
    let b = ref(30)
    const c = ref (80)
    const v = useMax(a, b, c)
    expect(v.value).toBe(80)

    b.value = 90

    expect(v.value).toBe(90)
  })

  it('should accept refs and numbers', () => {
    const a = ref(10)
    let b = ref(30)
    const v = useMax(a, b, 80)

    expect(v.value).toBe(80)
  })

  it('should accept single num', () => {
    const v = useMax(90)
    expect(v.value).toBe(90)
  })

  it('should accept zero args', () => {
    const v = useMax()
    expect(v.value).toBe(Number.NEGATIVE_INFINITY)
  })

  it('should accept nested arrays', () => {

  })
})

