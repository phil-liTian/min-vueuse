import { describe, expect, it } from "vitest";
import { useRound } from ".";
import { ref } from "vue";

describe("useRound", () => {
  it("should work", () => {
    const base = ref(-25.12)
    expect(useRound(2.3).value).toBe(2)
    expect(useRound(2.6).value).toBe(3)
    expect(useRound(base).value).toBe(-25)
  })
})