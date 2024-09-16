import { describe, expect, it } from "vitest";
import { reactive, ref } from "vue";
import { useArrayFind } from ".";

describe('useArrayFind', () => {
  it('should find positive', ()=> {
    const item1 = ref(1)
    const item2 = ref(2)
    const item3 = ref(3)
    const positive = useArrayFind([item1, item2, item3], (item) => item > 1)
    expect(positive.value).toBe(2)

    item1.value = 4
    expect(positive.value).toBe(4)
  })

  it('should work with reactive', () => {
    const list = reactive([1, 2, 3])
    const positive = useArrayFind(list, (item) => item > 4)
    expect(positive.value).toBe(undefined)

    list.push(5)
    expect(positive.value).toBe(5)

  })
})