import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useArrayFilter } from ".";

describe('useArrayFilter', () => {
  it('should work with ref', () => {
    const item1 = ref(0)
    const item2 = ref(2)
    const item3 = ref(4)
    const item4 = ref(6)
    const item5 = ref(8)

    const list = [item1, item2, item3, item4, item5]
    const result = useArrayFilter(list, (item) => item % 2 === 0)
    expect(result.value).toEqual([0, 2, 4, 6, 8])
    item1.value = 1
    expect(result.value).toEqual([2, 4, 6, 8])
  })

  it('should work with reactive array', () => {
    const list = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    const result = useArrayFilter(list, i => i % 2 === 0)
    expect(result.value).toStrictEqual([0, 2, 4, 6, 8])
    list.value.shift()
    expect(result.value).toStrictEqual([2, 4, 6, 8])
  })
})