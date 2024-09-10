import { describe, expect, it } from "vitest";
import { useTrunc } from ".";
import { ref } from "vue";

describe('useTrunc', () => {
  it('should be defined', () => {
    expect(useTrunc).toBeDefined()
  })

  it('should work', () => {
    const base = ref(1.95)
    const result = useTrunc(base)
    expect(result.value).toBe(1)

    base.value = -7.004
    expect(result.value).toBe(-7)

    base.value = 0
    expect(result.value).toBe(0)
    base.value = -0
    expect(result.value).toBe(-0)

    base.value = Number.POSITIVE_INFINITY
    expect(result.value).toBe(Number.POSITIVE_INFINITY)
  })
})