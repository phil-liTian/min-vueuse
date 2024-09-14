import { describe, expect, it } from "vitest";
import { logicAnd } from ".";
import { ref } from "vue";
import { toValue } from "@mini-vueuse/shared";


describe('logicAnd', () => {
  it('returns true when given no args', () => {
    expect(logicAnd().value).toBe(true)
  })

  it('return ture only when all arguments are truthy', () => {
    expect(toValue(logicAnd(ref(true), ref(true)))).toBe(true)
    expect(toValue(logicAnd(ref('foo'), ref(true)))).toBe(true)
    expect(toValue(logicAnd(ref('foo'), ref(1)))).toBe(true)

    expect(toValue(logicAnd(ref(true), ref(false)))).toBe(false)
    expect(toValue(logicAnd(ref('foo'), ref(0)))).toBe(false)
  })

  it('works with values', () => {
    expect(toValue(logicAnd(true))).toBe(true)
    expect(toValue(logicAnd('foo'))).toBe(true)

    expect(toValue(logicAnd(true, false))).toBe(false)
    expect(toValue(logicAnd(0))).toBe(false)
  })


  it('works with getter functions', () => {
    expect(toValue(logicAnd(() => true))).toBe(true)
    expect(toValue(logicAnd(() => 'foo'))).toBe(true)

    expect(toValue(logicAnd(() => true, () => false))).toBe(false)
    expect(toValue(logicAnd(() => 0))).toBe(false)
  })
})