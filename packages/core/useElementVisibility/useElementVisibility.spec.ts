import { beforeEach, describe, expect, it } from 'vitest'
import { useElementVisibility } from '.'

describe('useElementVisibility', () => {
  let el: HTMLElement
  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })
  it('should work when el is not an element', () => {
    const visible = useElementVisibility(null)
    expect(visible.value).toBeFalsy()
  })

  it('should work when window is undefined', () => {
    // @ts-ignore
    const visible = useElementVisibility(el, { window: null })
    expect(visible.value).toBeFalsy()
  })

  it('should work when threshold is undefined', () => {
    const visible = useElementVisibility(el, { threshold: undefined })
    expect(visible.value).toBeFalsy()
  })
})
