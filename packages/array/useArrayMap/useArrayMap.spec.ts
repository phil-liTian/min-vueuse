import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useArrayMap } from '.'

describe('useArrayMap', () => {
  it('should work with array refs', () => {
    const item = ref(0)
    const item1 = ref(2)
    const item2 = ref(4)
    const item3 = ref(6)
    const item4 = ref(8)
    const list = [item, item1, item2, item3, item4]
    const result = useArrayMap(list, (i) => i * 2)
    expect(result.value).toStrictEqual([0, 4, 8, 12, 16])
    item1.value = 4
    expect(result.value).toStrictEqual([0, 8, 8, 12, 16])
  })

  it('should work with reactive array', () => {
    const list = ref([1, 2, 3, 4])
    const result = useArrayMap(list, (i) => i * 2)
    expect(result.value).toStrictEqual([2, 4, 6, 8])
  })

  it('should work with custom map function', () => {
    const list = ref([1, 2, 3, 4])
    const result1 = useArrayMap(list, (i) => i.toString())
    result1.value.forEach((i) => expect(i).toBeTypeOf('string'))

    const result2 = useArrayMap(list, (i) => ({ value: i }))
    result2.value.forEach((item, index) => {
      expect(item).toBeTypeOf('object')
      expect(item).toHaveProperty('value', index + 1)
    })
  })
})
