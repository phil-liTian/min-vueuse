import { describe, expect, it } from "vitest";
import { isReactive, ref } from "vue";
import { useMannualRefHistory } from ".";

describe('useManualRefHistory', () => {
  it('should record', () => {
    const v = ref(0)
    const { history, commit } = useMannualRefHistory(v)
    expect(history.value.length).toBe(1)

    v.value = 2
    commit()
    expect(history.value.length).toBe(2)

    expect(history.value[0].snapshot).toBe(2)
    expect(history.value[1].snapshot).toBe(0)
  })

  it('should able to undo and redo', () => {
    const v = ref(0)
    const { commit, canRedo, canUndo, history, last, redo, undo, clear } = useMannualRefHistory(v)
    
    expect(canRedo.value).toBe(false)
    expect(canUndo.value).toBe(false)

    v.value = 2
    commit()
    v.value = 3
    commit()
    v.value = 4
    commit()

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)

    expect(history.value.length).toBe(4)
    expect(last.value.snapshot).toBe(4)

    undo()
    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(true)
    expect(last.value.snapshot).toBe(3)

    undo()
    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(true)
    expect(last.value.snapshot).toBe(2)

    redo()
    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(true)
    expect(last.value.snapshot).toBe(3)

    redo()
    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)
    expect(last.value.snapshot).toBe(4)

    clear()
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
  })

  it('object with deep', () => {
    const v = ref({ foo: 'bar' })
    const { history, commit } = useMannualRefHistory(v, { clone: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot.foo).toBe('bar')
    v.value.foo = 'new-bar'
    commit()
    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot.foo).toBe('new-bar')

    // different
    expect(history.value[1].snapshot.foo).toBe('bar')
    expect(history.value[1].snapshot).not.toBe(history.value[0].snapshot)
  })

  it('object with clone function', () => {
    const v = ref({ foo: 'bar' })
    const { history, commit } = useMannualRefHistory(v, { clone: (x) => JSON.parse(JSON.stringify(x))  })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot.foo).toBe('bar')
    v.value.foo = 'new-bar'
    commit()
    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot.foo).toBe('new-bar')

    // different
    expect(history.value[1].snapshot.foo).toBe('bar')
    expect(history.value[1].snapshot).not.toBe(history.value[0].snapshot)
  })

  it('dump/parse', () => {
    const v = ref({ bar: 'foo' })
    const { commit, history, undo } = useMannualRefHistory(v, {
      dump: (v) => JSON.stringify(v),
      parse: (v: string) => JSON.parse(v)
    })

    expect(history.value[0].snapshot).toBe('{"bar":"foo"}')
    v.value.bar = 'new-foo'
    commit()
    expect(history.value[1].snapshot).toBe('{"bar":"foo"}')
    expect(history.value[0].snapshot).toBe('{"bar":"new-foo"}')
    undo()
    expect(history.value[0].snapshot).toBe('{"bar":"foo"}')
  })

  it('reset', () => {
    const v = ref(0)
    const { reset, commit, history, undo } = useMannualRefHistory(v)
    v.value = 1
    commit()
    v.value = 2

    expect(history.value.length).toBe(2)

    // 没有commit, value回到commit之前的值
    reset()
    expect(v.value).toBe(1)
    expect(history.value.length).toBe(2)

    v.value = 3
    commit()

    v.value = 4
    reset()
    undo()

    expect(v.value).toBe(1)
  })

  it('snapshots should not be reactive', () => {
    const v = ref(0)
    const { commit, history } = useMannualRefHistory(v)
    expect(history.value.length).toBe(1)

    v.value = 2
    commit()
    expect(isReactive(history.value[0].snapshot)).toBe(false)
  })
})