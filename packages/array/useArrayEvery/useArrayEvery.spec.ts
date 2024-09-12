import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useArrayEvery } from ".";

describe('useArrayEvery', () => {
  it('should work with array of refs', () => {
    const item = ref(0)
    const item1 = ref(2)
    const item2 = ref(4)
    const item3 = ref(6)
    const item4 = ref(4)

    const list = [item, item1, item3, item2, item4]

    const result = useArrayEvery(list, (v) => v % 2 === 0)
    expect(result.value).toBe(true)
    item1.value = 1

    expect(result.value).toBe(false)
  })

  it('should work with reactive array', () => {
    const list = ref([0, 2, 4, 6, 8])
    const result = useArrayEvery(list, i => i % 2 === 0)
    expect(result.value).toBe(true)
    list.value.push(9)
    expect(result.value).toBe(false)
  })
})