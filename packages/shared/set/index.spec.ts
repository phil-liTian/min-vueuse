import { describe, expect, it } from "vitest";
import { reactive, ref } from "vue";
import { set } from ".";

describe('set', () => {
  it('set ref', () => {
    const source = ref('foo')
    set(source, '123')
    expect(source.value).toBe('123')
  })

  it('set reactive', () => {
    const source = reactive({ foo: 'bar' })
    set(source, 'foo', 'bar1')
    expect(source.foo).toBe('bar1')
  })
})