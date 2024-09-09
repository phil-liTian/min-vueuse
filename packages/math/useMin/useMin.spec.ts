import { describe, it, expect } from 'vitest'
import { useMin } from './index'
import { ref } from 'vue'


describe('useMin', () => {
  it('should be defined', () => {
    expect(useMin).toBeDefined()
  })

  it('should accept numbers', () => { 
    const v = useMin(1, 2, 3)
    expect(v.value).toBe(1)
  })

  it('should accept refs', () => {
    const a = ref(10)
    let b = ref(30)
    const c = ref (80)
    const v = useMin(a, b, c)
    expect(v.value).toBe(10)

    b.value = 90

    expect(v.value).toBe(10)
  })

  it('should accept refs and numbers', () => {
    const a = ref(10)
    let b = ref(30)
    const v = useMin(a, b, 80)

    expect(v.value).toBe(10)
  })

  it('should accept single num', () => {
    const v = useMin(90)
    expect(v.value).toBe(90)
  })

  it('should accept zero args', () => {
    const v = useMin()
    expect(v.value).toBe(Number.POSITIVE_INFINITY)
  })

  it('should accept nested arrays', () => {
    
  })
})

