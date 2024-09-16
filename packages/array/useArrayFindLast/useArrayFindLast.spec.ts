import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useArrayFindLast } from ".";

describe('useArrayFindLast', () => {
  it('should find positive', () => {
    const item1 = ref(1)
    const item2 = ref(2)
    const item3 = ref(3)

    const positive = useArrayFindLast([item1, item2, item3], (item) => item > 1)
    expect(positive.value).toBe(item3.value)

    item3.value  = 1
    expect(positive.value).toBe(item2.value)
  })

  it('should work with reactive', () => {
    const list = ref([1, 2, 3])
    const result = useArrayFindLast(list, (item) => item > 10)
    expect(result.value).toBe(undefined)
  })
})