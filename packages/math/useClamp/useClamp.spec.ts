import { describe, expect, it } from "vitest";
import { useClamp } from ".";
import { computed, isReadonly, ref } from "vue";
import { clamp } from "@mini-vueuse/shared";

describe('useClamp',() => {
  it('happy path', () => {
    const v = useClamp(10, 0 , 100)
    expect(v.value).toBe(10)
  })

  it('should be max', () => {
    const value = ref(10)
    const min = ref(0)
    const max = ref(100)

    const v = useClamp(value, min, max)
    expect(v.value).toBe(10)
    v.value = 1000
    expect(v.value).toBe(100)

    max.value = 90
    expect(v.value).toBe(90)

    max.value = 100
    expect(v.value).toBe(90)
  })

  it('should be min', () => {
    const value = ref(10)
    const min = ref(0)
    const max = ref(100)

    const v = useClamp(value, min, max)
    expect(v.value).toBe(10)
    v.value = -10
    expect(v.value).toBe(0)

    min.value = 90
    expect(v.value).toBe(90)

    min.value = 91
    expect(v.value).toBe(91)
  })

  it('should work with computed', () => {
    const baseRef = ref(10)
    const value = computed(() => baseRef.value)
    const min = ref(0)
    const max = ref(100)

    const v = useClamp(value, min, max)

    expect(v.value).toBe(10)

    baseRef.value = -10
    expect(v.value).toBe(0)

    baseRef.value = 110
    expect(v.value).toBe(100)
    expect(isReadonly(v)).toBeTruthy()
  })
})