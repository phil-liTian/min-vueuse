import { describe, expect, it } from 'vitest'
import { reactive, ref } from 'vue'
import { useArrayUnique } from '.'

describe('useArrayUnique', () => {
  it('should work with ref', () => {
    const item1 = ref(1)
    const item2 = ref(2)
    const item3 = ref(2)
    expect(useArrayUnique([item1, item2, item3]).value).toEqual([1, 2])

    const arr = ref([1, 2, 3, 3, 2])
    expect(useArrayUnique(arr).value).toEqual([1, 2, 3])
  })

  it('should work with custom compareFn', () => {
    const list = reactive([
      {
        id: 1,
        name: 'foo'
      },
      {
        id: 2,
        name: 'bar'
      },
      {
        id: 1,
        name: 'baz'
      }
    ])
    const result = useArrayUnique(list, (a, b) => a.id == b.id)
    expect(result.value.length).toBe(2)
  })
})
