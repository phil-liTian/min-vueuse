import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useActiveElement } from '.'
import { nextTick } from 'vue'

describe('useActiveElement', () => {
  let input: HTMLInputElement
  let shadowHost: HTMLElement
  let shadowRoot: ShadowRoot
  let shadowInput: HTMLInputElement

  beforeEach(() => {
    shadowHost = document.createElement('div')
    // 影子 DOM 允许将一个 DOM 子树与主文档 DOM 隔离。这意味着在影子 DOM 内部定义的元素和样式不会影响到外部文档，反之亦然。它为 Web 组件提供了封装性，使得组件的内部结构和样式可以独立管理，避免与页面上的其他部分发生冲突。
    shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    input = document.createElement('input')
    shadowInput = input.cloneNode(true) as HTMLInputElement

    document.body.appendChild(input)
    shadowRoot.appendChild(shadowInput)
    document.body.appendChild(shadowHost)
  })

  afterEach(() => {
    input.remove()
  })

  it('happy path', () => {
    const activeElement = useActiveElement()
    expect(activeElement.value).to.equal(document.body)

    input.focus()
    expect(activeElement.value).to.equal(input)
  })

  it('should accept custom document', () => {
    const activeElement = useActiveElement({ document: shadowRoot })
    shadowInput.focus()
    expect(activeElement.value).to.equal(shadowInput)
  })

  it('should observe focus/blur events', () => {
    const activeElement = useActiveElement()
    input.focus()

    expect(activeElement.value).to.equal(input)

    input.blur()
    expect(activeElement.value).to.equal(document.body)
  })

  it.skip('should update when activeElement is removed', async () => {
    const activeElement = useActiveElement({ triggerOnRemoval: true })

    input.focus()
    expect(activeElement.value).toBe(input)

    input.remove()
    await nextTick()

    expect(activeElement.value).to.equal(document.body)
  })

  it('should update when activeElement is removed / shadowRoot', async () => {
    const activeElement = useActiveElement({ triggerOnRemoval: true, document: shadowRoot })

    shadowInput.focus()
    expect(activeElement.value).toBe(shadowInput)
    shadowHost.remove()
    await nextTick()
    // expect(activeElement.value).to.equal(null)
  })
})
