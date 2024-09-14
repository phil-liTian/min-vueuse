import { describe, expect, it, vi } from "vitest";
import { useVModel } from ".";
import { nextTick } from "vue";

describe('useVModel', () => {
  const defaultKey = 'modelValue'
  const defaultValue = 'default'
  const defaultProps = () => ({
    [defaultKey]: defaultValue
  })

  it('should work with default value', () => {
    const data = useVModel(defaultProps())
    expect(data.value).toBe(defaultValue)
  })

  it('should work with null', () => {
    const data = useVModel({ [defaultKey]: null })
    expect(data.value).toBe(null)
  })

  it('should work with boolean', () => {
    const data = useVModel({ [defaultKey]: false })
    expect(data.value).toBe(false)
  })

  it('should work with arguments', () => {
    const props = {
      ...defaultProps(),
      data: 'data',
    }

    const data = useVModel(props, 'data')
    expect(data.value).toBe('data')
  })

  it('should emit on value change', () => {
    const emitMock = vi.fn()
    const data = useVModel(defaultProps(), undefined, emitMock)
    data.value = 'change'
    expect(emitMock).toHaveBeenCalledWith('update:modelValue', 'change')
  })

  it('should use eventName if set', () => {
    const emitMock = vi.fn()
    const data = useVModel(defaultProps(), undefined, emitMock, { eventName: 'change' } )
    data.value = 'new-value'
    expect(emitMock).toHaveBeenCalledWith('change', 'new-value')
  })

  it('should emit with passive', async () => {
    const emitMock = vi.fn()
    const props = {
      ...defaultProps(),
      age: 18
    }
    const data = useVModel(props, 'age', emitMock, { passive: true })
    
    data.value = 20
    await nextTick()
    expect(emitMock).toHaveBeenCalledWith('update:age', 20)
  })

  it('should emit object props', async () => {
    const emitMock = vi.fn()

    const props = {
      ...defaultProps(),
      data: {
        age: 18
      }
    }

    const data = useVModel(props, 'data', emitMock, { passive: true, deep: true })

    data.value.age = 20

    await nextTick()
    expect(emitMock).toHaveBeenCalledWith('update:data', { age: 20 })
  })

  it('should emit array props', async () => {
    const props = {
      ...defaultProps(),
      data: {
        habbies: ['runner']
      }
    }
    const emitMock = vi.fn()

    const data = useVModel(props, 'data', emitMock, { deep: true, passive: true } )
    data.value.habbies.push('coding')
    await nextTick()
    expect(emitMock).toHaveBeenCalledWith('update:data', { habbies: ['runner', 'coding'] })
  })

  it('should work with user define defaultValue', () => {
    const props: Record<string, any> = {
      ...defaultProps(),
      a: 0,
      b: '',
      c: false,
      d: null,
      e: undefined,
    }

    const emitMock = vi.fn()

    const data = useVModel(props, 'data', emitMock, { defaultValue: 'default-data' })
    const dataA = useVModel(props, 'a', emitMock, { defaultValue: 'default-data' })
    const dataB = useVModel(props, 'b', emitMock, { defaultValue: 'default-data' })
    const dataC = useVModel(props, 'c', emitMock, { defaultValue: 'default-data' })
    const dataD = useVModel(props, 'd', emitMock, { defaultValue: 'default-data' })
    const dataE = useVModel(props, 'e', emitMock, { defaultValue: 'default-data' })

    expect(data.value).toBe('default-data')
    expect(dataA.value).toBe(0)
    expect(dataB.value).toBe('')
    expect(dataC.value).toBe(false)
    expect(dataD.value).toBe(null)
    expect(dataE.value).toBe('default-data')
  })

  it('should work with user define defaultValue with passive', () => {
    const props: Record<string, unknown> = {
      ...defaultProps(),
      a: 0,
      b: '',
      c: false,
      d: null as string | null,
      e: undefined as string | undefined,
    }
    const emitMock = vi.fn()

    const data = useVModel(props, 'data', emitMock, { defaultValue: 'default-data', passive: true })
    const dataA = useVModel(props, 'a', emitMock, { defaultValue: 'default-data', passive: true })
    const dataB = useVModel(props, 'b', emitMock, { defaultValue: 'default-data', passive: true })
    const dataC = useVModel(props, 'c', emitMock, { defaultValue: 'default-data', passive: true })
    const dataD = useVModel(props, 'd', emitMock, { defaultValue: 'default-data', passive: true })
    const dataE = useVModel(props, 'e', emitMock, { defaultValue: 'default-data', passive: true })

    expect(data.value).toBe('default-data')
    expect(dataA.value).toBe(0)
    expect(dataB.value).toBe('')
    expect(dataC.value).toBe(false)
    expect(dataD.value).toBe(null)
    expect(dataE.value).toBe('default-data')
  })

  it('should work with classes', async () => {
    const emitMock = vi.fn()

    class SomeClass {
      num1 = 1

      someMethod() {}
    }

    const props = { cl: new SomeClass() }

    const ref = useVModel(props, 'cl', emitMock, { passive: true, deep: true })

    ref.value.num1 = 10

    await nextTick()

    expect(emitMock).toBeCalledTimes(1)
    const emitValue = emitMock.mock.calls[0][1]

    expect(emitValue instanceof SomeClass).toBeTruthy()
  })

  it('should clone object', async () => {
    const emitMock = vi.fn()

    const props = {
      person: {
        age: 18,
        child: { age: 2 },
      },
    }

    const data = useVModel(props, 'person', emitMock, { passive: true, clone: true })
    const dataDeep = useVModel(props, 'person', emitMock, { passive: true, clone: true, deep: true })

    data.value.age = 20

    await nextTick()
    expect(props.person).not.toBe(data.value)
    expect(props.person).toEqual(expect.objectContaining({ age: 18 }))

    dataDeep.value.child.age = 3

    expect(props.person).not.toBe(dataDeep.value)
    expect(props.person).toEqual(expect.objectContaining({
      child: { age: 2 },
    }))
  })

  it('should trigger beforeEmit return false', () => {
    const emitMock = vi.fn()
    const beforeEmitMock = vi.fn()
    let res = ''

    const beforeEmit = (value) => {
      res = value
      beforeEmitMock()
      return false;
    }

    const data = useVModel(defaultProps(), undefined, emitMock, { shouldEmit: beforeEmit })
    data.value = 'changed'
    expect(emitMock).toBeCalledTimes(0)

    expect(emitMock).not.toBeCalled()
    expect(beforeEmitMock).toBeCalledTimes(1)
    expect(res).toBe('changed')
  })

  it('should trigger beforeEmit return true', () => {
    const emitMock = vi.fn()
    const beforeEmitMock = vi.fn()
    let res = ''

    const beforeEmit = (value) => {
      res = value
      beforeEmitMock()
      return true;
    }

    const data = useVModel(defaultProps(), undefined, emitMock, { shouldEmit: beforeEmit })
    data.value = 'changed'
    expect(emitMock).toBeCalledTimes(1)

    expect(emitMock).toHaveBeenCalledWith('update:modelValue', 'changed')
    expect(beforeEmitMock).toBeCalledTimes(1)
    expect(res).toBe('changed')
  })

})