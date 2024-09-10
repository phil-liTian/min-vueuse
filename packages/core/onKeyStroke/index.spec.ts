import { Fn } from "@mini-vueuse/shared";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, Ref } from "vue";
import { KeyStrokeEventName, onKeyStroke } from ".";


describe('onKeyStroke', () => {
  let element: Ref<HTMLElement>;
  let cbFn: Fn

  beforeEach(() => {
    cbFn = vi.fn()
    element = ref(document.createElement('div'))
  })

  function createKeyEvent(key: string, type: KeyStrokeEventName, repeat = false) {
    const ev = new KeyboardEvent(type, { key, repeat })
    element.value.dispatchEvent(ev)
  }

  it('listen to single key', () => {
    onKeyStroke('A', cbFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    expect(cbFn).toHaveBeenCalledTimes(1)
  })

  it('listen to multi keys', () => {
    onKeyStroke(['A', 'B'], cbFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    expect(cbFn).toHaveBeenCalledTimes(2)
  })

  it('use function filter', () => {
    const filter = (e: KeyboardEvent) => e.key === 'A'
    onKeyStroke(filter, cbFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    expect(cbFn).toHaveBeenCalledTimes(1)
  })

  it('listen to all keys by boolean', () => {
    onKeyStroke(true, cbFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    expect(cbFn).toHaveBeenCalledTimes(3)
  })

  it('listen to all keys by constructor', () => {
    onKeyStroke(cbFn, { target: element })
    createKeyEvent('A', 'keydown')
    createKeyEvent('B', 'keydown')
    createKeyEvent('C', 'keydown')
    expect(cbFn).toHaveBeenCalledTimes(3)
  })

  it('listen to key press', () => {
    onKeyStroke('A', cbFn, { eventName: 'keypress', target: element })
    createKeyEvent('A', 'keypress')
    createKeyEvent('B', 'keypress')
    expect(cbFn).toHaveBeenCalledTimes(1)
  })

  it('ignore repeat key', () => {
    onKeyStroke('A', cbFn, { eventName: 'keypress', target: element, dedupe: true })
    createKeyEvent('A', 'keypress', false)
    createKeyEvent('A', 'keypress', true)
    createKeyEvent('A', 'keypress', true)
    expect(cbFn).toHaveBeenCalledTimes(1)
  })
})