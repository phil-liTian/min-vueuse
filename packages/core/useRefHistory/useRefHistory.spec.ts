import { describe, expect, it } from "vitest";
import { h, nextTick, ref } from "vue";
import { useRefHistory } from ".";

describe('useRefHistory', () => {
  it('sync: should record', async () => {
    const v = ref(0)
    const { history } = useRefHistory(v, { flush: 'sync' })
    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 2

    // await nextTick()
    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(2)
    expect(history.value[1].snapshot).toBe(0)
  })

  it('sync: should be able to undo and redo', () => {
    const v = ref(0)
    const { redo, undo, history, canRedo, canUndo, clear, last } = useRefHistory(v, { flush: 'sync' })

    v.value = 1
    expect(history.value[0].snapshot).toBe(1)

    v.value = 2
    v.value = 3
    expect(history.value[0].snapshot).toBe(3)
    expect(last.value.snapshot).toBe(3)
    undo()
    expect(history.value[0].snapshot).toBe(2)

    redo()
    expect(history.value[0].snapshot).toBe(3)
    
    clear()
    expect(canRedo.value).toBe(false)
    expect(canUndo.value).toBe(false)

  })

  it('sync: object with deep', () => {
    const v = ref({ foo: 'bar' })
    const { history, redo, undo, canRedo, canUndo } = useRefHistory(v, { deep: true, flush: 'sync' })

    expect(history.value.length).toBe(1)

    v.value.foo = 'new-bar';

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot.foo).toBe('new-bar')

    expect(history.value[1].snapshot.foo).toBe('bar')
  })

  it('sync: shallow watch with clone', () => {
    const v = ref({ foo: 'bar' })
    const { history, undo } = useRefHistory(v, { flush: 'sync', clone: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot.foo).toBe('bar')

    v.value.foo = 'foo'
    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot.foo).toBe('bar')

    v.value = { foo: 'new-foo' }

    expect(history.value[0].snapshot.foo).not.toBe(history.value[1].snapshot.foo)
  })

  it('sync: dump + parse', () => {
    const v = ref({ foo: 'bar' })
    const { history, undo } = useRefHistory(v, {
      flush: 'sync',
      deep: true,
      dump: v => JSON.stringify(v),
      parse: (v: string) => JSON.parse(v)
    })

    expect(history.value[0].snapshot).toBe('{"foo":"bar"}')
    v.value.foo = 'new-bar'
    expect(history.value.length).toBe(2)

    expect(history.value[0].snapshot).toBe('{"foo":"new-bar"}')
    expect(history.value[1].snapshot).toBe('{"foo":"bar"}')

    undo()
    expect(v.value.foo).toBe('bar')
  })

  it('sync: commit', () => {
    const v = ref(0)
    const { commit, history } = useRefHistory(v, { flush: 'sync' })
    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    commit()
    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(0)
    expect(history.value[1].snapshot).toBe(0)
  })

  it('sync: without batch', () => {
    const v = ref({ foo: 1, bar: 'one' })
    const { history } = useRefHistory(v, { flush: 'sync', deep: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toEqual({ foo: 1, bar: 'one' })

    v.value.foo = 2
    v.value.bar = 'two'

    expect(history.value.length).toBe(3)
    expect(history.value[0].snapshot).toEqual({ foo: 2, bar: 'two' })
    expect(history.value[1].snapshot).toEqual({ foo: 2, bar: 'one' })
    expect(history.value[2].snapshot).toEqual({ foo: 1, bar: 'one' })
  })

  it('sync: with batch', () => {
    const v = ref({ foo: 1, bar: 'one' })
    const { history, batch } = useRefHistory(v, { deep: true })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toEqual({ foo: 1, bar: 'one' })

    batch(() => {
      v.value.foo = 2
      v.value.bar = 'two'
    })

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toEqual({ foo: 2, bar: 'two' })
    expect(history.value[1].snapshot).toEqual({ foo: 1, bar: 'one' })

    batch((cancel) => {
      v.value.foo = 3
      v.value.bar = 'third'
      cancel()
    })

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toEqual({ foo: 2, bar: 'two' })
    expect(history.value[1].snapshot).toEqual({ foo: 1, bar: 'one' })
  })


  it('sync: pause and resume', () => {
    const v = ref(1)
    const { resume, history, last, pause } = useRefHistory(v, { flush: 'sync' })
    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(1)

    pause()
    v.value = 2

    expect(history.value.length).toBe(1)
    expect(last.value.snapshot).toBe(1)

    resume()

    v.value = 3
    expect(history.value.length).toBe(2)
    expect(last.value.snapshot).toBe(3)

  })

  it('sync: reset', () => {
    const v = ref(0)
    const { history, commit, undoStack, redoStack, pause, reset, undo } = useRefHistory(v, { flush: 'sync' })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 1

    pause()

    v.value = 2

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(1)
    expect(history.value[1].snapshot).toBe(0)

    reset()

    // v value needs to be the last history point, but history is unchanged
    expect(v.value).toBe(1)

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(1)
    expect(history.value[1].snapshot).toBe(0)

    reset()

    // Calling reset twice is a no-op
    expect(v.value).toBe(1)

    expect(history.value.length).toBe(2)
    expect(history.value[1].snapshot).toBe(0)
    expect(history.value[0].snapshot).toBe(1)

    // Same test, but with a non empty redoStack

    v.value = 3
    commit()

    undo()

    v.value = 2

    reset()

    expect(v.value).toBe(1)

    expect(undoStack.value.length).toBe(1)
    expect(undoStack.value[0].snapshot).toBe(0)

    expect(redoStack.value.length).toBe(1)
    expect(redoStack.value[0].snapshot).toBe(3)
  })

  it('sync: dispose', () => {
    const v = ref(0)
    const { history, dispose, last } = useRefHistory(v, { flush: 'sync' })

    v.value = 1
    v.value = 2

    dispose()

    v.value = 3

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(2)
    expect(last.value.snapshot).toBe(2)
  })
})