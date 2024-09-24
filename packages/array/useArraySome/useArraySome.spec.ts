import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useArraySome } from '.'

describe('useArraySome', () => {
  it('should work with array of refs', () => {
    const item = ref(0)
    const item1 = ref(2)
    const item2 = ref(4)
    const item3 = ref(6)
    const item4 = ref(8)
    const list = [item, item1, item2, item3, item4]
    const result = useArraySome(list, (i) => i > 10)
    expect(result.value).toBe(false)
    item.value = 11
    expect(result.value).toBe(true)
  })
})
