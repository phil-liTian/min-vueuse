import { describe, expect, it } from "vitest";
import { readonly, ref } from "vue";
import { createProjection } from ".";

describe('createProjection', () => {
  it('should work', () => {
    const fromStart = ref(0)
    const fromEnd = ref(10)
    const toRange: readonly [ number, number] = [50, 100]

    const useProjector = createProjection(() => [fromStart.value, fromEnd.value], toRange)
    const input = ref(0)
    const output = useProjector(input)
    expect(output.value).toBe(50)

    input.value = 10
    expect(output.value).toBe(100)

    // (5 - 0) / (10 - 0) * (100 - 50) + 50
    input.value = 5
    expect(output.value).toBe(75)
  })
})