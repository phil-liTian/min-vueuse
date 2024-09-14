import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useSum } from ".";

describe('useSum', () => {
  it('should return the sum of the array', () => {
    const array = ref([1, 2, 3, 4])
    const sum = useSum(array)
    expect(sum.value).toBe(10)

    array.value = [-1, -2, -3, -1]
    expect(sum.value).toBe(-7)
  })

  it('rest usage', () => {
    const sum = useSum(1, ref(2), 3, 4)
    expect(sum.value).toBe(10)
  })
})