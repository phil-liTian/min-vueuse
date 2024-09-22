import { beforeEach, describe, expect, it } from 'vitest'
import { ref, Ref } from 'vue'
import { useFocusWithin } from '.'

describe('useFocusWithin', () => {
  let parent: Ref<HTMLFormElement>
  let child: Ref<HTMLDivElement>
  let grandChild: Ref<HTMLInputElement>
  beforeEach(() => {
    parent = ref(document.createElement('form'))
    // 给 HTML 元素添加 tabIndex 属性有以下主要作用
    // 1. tabIndex 属性允许你指定元素在用户使用键盘的 “Tab” 键进行导航时的顺序
    // 2. 默认情况下，只有一些特定的 HTML 元素（如链接、表单元素等）是可聚焦的。但是，通过设置 tabIndex 属性，你可以使几乎任何 HTML 元素可聚焦
    parent.value.tabIndex = 0
    document.body.appendChild(parent.value)

    child = ref(document.createElement('div'))
    child.value.tabIndex = 1
    parent.value.appendChild(child.value)

    grandChild = ref(document.createElement('input'))
    child.value.tabIndex = 2
    child.value.appendChild(grandChild.value)
  })

  it('should initialize', () => {
    const { focused } = useFocusWithin(parent)
    expect(focused.value).toBeFalsy()

    parent.value.focus()
    expect(focused.value).toBeTruthy()
    parent.value.blur()
    expect(focused.value).toBeFalsy()

    child.value.focus()
    expect(focused.value).toBeTruthy()
    child.value.blur()
    expect(focused.value).toBeFalsy()
  })
})
