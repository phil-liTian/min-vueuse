import { beforeEach, describe, expect, it } from 'vitest'
import { useFocus } from '.'
import { ref, Ref } from 'vue'

describe('useFocus', () => {
  let target: Ref<HTMLButtonElement>

  beforeEach(() => {
    target = ref(document.createElement('button'))
    document.body.appendChild(target.value)
  })

  it('should initialize property', () => {
    const { focused } = useFocus(target)
    expect(focused.value).toBeFalsy()
  })

  it('should focus state in reactive ref value', () => {
    const { focused } = useFocus(target)
    expect(focused.value).toBeFalsy()

    target.value.focus()
    expect(focused.value).toBeTruthy()
    target.value.blur()
    expect(focused.value).toBeFalsy()
  })

  it('reflect reactive ref `focused` state in DOM', () => {
    const { focused } = useFocus(target)
    expect(focused.value).toBeFalsy()
    focused.value = true

    expect(document.activeElement).toBe(target.value)

    focused.value = false

    expect(document.activeElement).not.toBe(target.value)
  })

  it('should work with focusVisible=true', () => {
    const { focused } = useFocus(target, { focusVisible: true })
    expect(focused.value).toBe(false)

    let event = new Event('focus')
    Object.defineProperty(event, 'target', { value: { matches: () => true } })
    target.value?.dispatchEvent(event)
    expect(focused.value).toBe(true)
    target.value?.dispatchEvent(new Event('blur'))
    expect(focused.value).toBeFalsy()

    event = new Event('focus')
    Object.defineProperty(event, 'target', { value: { matches: () => false } })
    target.value?.dispatchEvent(event)
    expect(focused.value).toBeFalsy()
    target.value?.dispatchEvent(new Event('blur'))
    expect(focused.value).toBeFalsy()
  })

  describe('when target is mission', () => {
    it('should initialize properly', () => {
      const { focused } = useFocus(null)
      expect(focused.value).toBeFalsy()
    })
  })

  describe('can be set initialValue', () => {
    it('should initialize focus', () => {
      const { focused } = useFocus(target, { initialValue: true })

      expect(document.activeElement).toBe(target.value)
      expect(focused.value).toBeTruthy()
    })
  })
})
