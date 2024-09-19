import { describe, expect, it, vi } from 'vitest'
import { useToggle } from '.'
import { isRef, ref } from 'vue'
import { toValue } from '../toValue'

describe('useToggle', () => {
  it('default result', () => {
    const result = useToggle()
    const [value, toggle] = result

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(typeof toggle).toBe('function')
    expect(isRef(value)).toBe(true)
    expect(toValue(value)).toBe(false)
  })

  it('default result with initial value', () => {
    const result = useToggle(true)
    const [value, toggle] = result

    expect(isRef(value)).toBe(true)
    expect(toValue(value)).toBe(true)
  })

  it('should toggle', () => {
    const [value, toggle] = useToggle()
    expect(toggle()).toBe(true)
    expect(toggle()).toBe(false)
    expect(toValue(value)).toBe(false)
  })

  it('should receive toggle param', () => {
    const [value, toggle] = useToggle()
    expect(toggle(true)).toBe(true)
    expect(toValue(value)).toBe(true)
  })

  it('ref initial', () => {
    const isDark = ref(false)
    const toggle = useToggle(isDark)
    expect(toggle()).toBe(true)
    expect(toggle()).toBe(false)
    expect(toValue(isDark)).toBe(false)
  })

  it('should toggle with truthy/falsy', () => {
    const status = ref('ON')
    const toggle = useToggle(status, {
      truthyValue: 'ON',
      falsyValue: 'OFF'
    })

    expect(toggle()).toBe('OFF')
    expect(toValue(status)).toBe('OFF')
    expect(toggle()).toBe('ON')

    const plainStatus = 'ON'
    const [value, plainToggle] = useToggle(plainStatus, {
      truthyValue: 'ON',
      falsyValue: 'OFF'
    })

    expect(toValue(value)).toBe('ON')
    expect(plainToggle()).toBe('OFF')
  })
})
