import { describe, expect, it, vi } from 'vitest'
import { useMutationObserver } from '.'
import { promiseTimeout } from '@mini-vueuse/shared'
import { computed, ref } from 'vue'

describe('useMutationObserver', () => {
  it('should work with attribute', async () => {
    const cb = vi.fn()
    const target = document.createElement('div')
    target.setAttribute('id', 'header')
    useMutationObserver(target, cb, {
      attributes: true
    })
    target.setAttribute('id', 'footer')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)
    target.setAttribute('id', 'header')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with childList', async () => {
    const parent = document.createElement('div')
    const cb = vi.fn()

    useMutationObserver(parent, cb, {
      childList: true
    })
    parent.appendChild(document.createElement('div'))
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should work with subtree', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()

    useMutationObserver(target, cb, {
      subtree: true,
      childList: true
    })
    const child = document.createElement('div')
    target.appendChild(child)
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)

    child.appendChild(document.createElement('div'))
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with characterData', async () => {
    const target = document.createTextNode('123')
    const cb = vi.fn()
    // @ts-expect-error
    useMutationObserver(target, cb, {
      characterData: true
    })

    target.data = 'content'
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)

    target.data = 'new-content'
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with attributeFilter', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()
    useMutationObserver(target, cb, {
      attributes: true,
      attributeFilter: ['id']
    })

    target.setAttribute('id', 'header')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)
    target.setAttribute('class', 'header')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('support stop', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()
    const { stop } = useMutationObserver(target, cb, {
      attributes: true
    })

    target.setAttribute('id', 'header')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)

    stop()
    target.setAttribute('id', 'footer')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('support takeRecords', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()
    const { takeRecords } = useMutationObserver(target, cb, {
      attributes: true
    })

    target.setAttribute('id', 'header')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)

    target.setAttribute('id', 'footer')
    const records = takeRecords()
    await promiseTimeout(10)
    expect(records).toHaveLength(1)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should work with multiple targets', async () => {
    const headerElement = ref<HTMLDivElement | null>(document.createElement('div'))
    const footerElement = ref<HTMLDivElement | null>(document.createElement('div'))
    const targets = computed(() => [headerElement.value, footerElement.value])
    const cb = vi.fn()

    const { takeRecords } = useMutationObserver(targets, cb, {
      attributes: true
    })

    headerElement.value?.setAttribute('id', 'header')
    footerElement.value?.setAttribute('id', 'footer')
    let records = takeRecords()
    await promiseTimeout(10)
    expect(records).toHaveLength(2)
    expect(records![0].target).toBe(headerElement.value)
    expect(records![1].target).toBe(footerElement.value)

    headerElement.value = null
    footerElement.value?.removeAttribute('id')
    records = takeRecords()
    await promiseTimeout(10)
    expect(records).toHaveLength(1)
    expect(records![0].target).toBe(footerElement.value)
  })
})
