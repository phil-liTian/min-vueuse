import { describe, expect, it } from "vitest";
import { useProjection } from ".";

describe('useProjection', () => {
  it('should work', () => {
    const output = useProjection(1, [0, 10], [0, 200])
    expect(output.value).toBe(20)
  })
})