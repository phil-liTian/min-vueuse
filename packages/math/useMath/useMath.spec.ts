import { describe, expect, it } from "vitest";
import { useMath } from ".";
import { ref } from "vue";

describe('useMath', () => {
  it('should accept number', () =>{
    const v = useMath('abs', -1)
    expect(v.value).toBe(1)
    const v1 = useMath('pow', 2, 3)
    expect(v1.value).toBe(8)
  })

  it('should accept refs', () => {
    const base = ref(-1)
    const v = useMath('abs', base)
    expect(v.value).toBe(1)

    const num = ref(4)
    const v1 = useMath('sqrt', num)
    expect(v1.value).toBe(2)
    num.value = 9
    expect(v1.value).toBe(3)
  })
})