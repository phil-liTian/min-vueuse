import { describe, expect, it } from 'vitest'
import { reactive, ref } from 'vue'
import { useArrayReduce } from '.'

describe('useArrayReduce', () => {
  it('should calculate the array sum', () => {
    const item1 = ref(1)
    const item2 = ref(2)
    const result = useArrayReduce([item1, item2, 3], (a, b) => a + b)
    expect(result.value).toBe(6)

    item1.value = 10
    expect(result.value).toBe(15)
  })

  it('should work with reactive list', () => {
    const list = reactive([1, 2, 3])
    const sum = useArrayReduce(list, (a, b) => a + b)
    expect(sum.value).toBe(6)
    list.push(4)
    expect(sum.value).toBe(10)
  })

  it('should work with initial value', () => {
    const list = [1, 2, 3]
    const sum = useArrayReduce(list, (a, b) => a + b, 1)
    expect(sum.value).toBe(7)
  })
})
