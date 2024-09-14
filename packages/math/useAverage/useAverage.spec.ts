import { describe, expect, it } from "vitest";
import { useAverage } from ".";
import { ref } from "vue";

describe("useAverage", () => {
  it("should return average", () => {
    const arr = ref([1, 2, 3])

    const v = useAverage(arr)

    expect(v.value).toBe(2)

    arr.value = [4, 5, 6]
    expect(v.value).toBe(5)
  })

  it('should work with ref', () => {
    const a = ref(10)
    const arr = [a, 1, 2, 3, () => 4]
    const v = useAverage(arr)
    expect(v.value).toBe(4)
    a.value = 20
    expect(v.value).toBe(6)
  })

  it('should be the average when the array is a getter', () => {
    const arr = ref([1, 2, 3])
    const last = ref(0)

    const v = useAverage(() => arr.value.concat(last.value))

    expect(v.value).toBe(1.5)

    last.value = 10
    expect(v.value).toBe(4)
  })
})