import { describe, expect, it, test } from "vitest";
import { useCloned } from ".";
import { ref } from "vue";


describe('useCloned', () => {
  it('work with simple object and ref object', () => {
    const data =  ref({ test: 'test' })
    const { cloned, sync } = useCloned(data)
    expect(cloned?.value).toEqual(data.value)

    data.value.test = 'new-test'
    sync()
    expect(cloned?.value).toEqual({ test: 'new-test' })
    

    const plainData = { test: 'plainTest' }
    const { cloned: plainCloned, sync: plainSync } = useCloned(plainData)
    expect(plainCloned?.value).toEqual(plainData)
    plainData.test = 'new-plainTest'
    plainSync()
    expect(plainCloned?.value).toEqual({ test: 'new-plainTest' })
  })

  it('work with getter function', () => {
    const data = ref({ test: 'test' })
    const { cloned, sync } = useCloned(() => data.value)
    expect(cloned?.value).toEqual(data.value)
    data.value.test = 'new-test'
    sync()
    expect(cloned?.value).toEqual(data.value)
  })

  it('work with refs and manual', () => {
    const data = ref({ test: 'test' })
    const { cloned, sync } = useCloned(data, { manual: true })
    expect(cloned?.value).toEqual(data.value)
    data.value.test = 'new-test'
    expect(cloned?.value).not.toEqual(data.value)
    sync()
    expect(cloned?.value).toEqual(data.value)
  })

  it('work with custom clone function', () => {
    const data = ref<Record<string, string>>({ test: 'test' })
    const { cloned, sync } = useCloned(data, {
      clone: (value) => ({ ...value, a: '123' })
    })

    expect(cloned?.value.test).toBe('test')
    expect(cloned?.value.a).toBe('123')
  })
})