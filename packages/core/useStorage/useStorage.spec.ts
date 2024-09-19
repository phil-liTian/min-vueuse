import { describe, expect, it, vi } from "vitest";
import { useStorage } from ".";
import { nextTwoTick, useSetup } from "../../.test";
import { ref, warn, watch } from "vue";
import { debounceFilter, promiseTimeout } from "@mini-vueuse/shared";

const KEY = 'custom-key'

describe('useStorage', () => {
  console.error = vi.fn()
  const storageState = new Map<string, string | number | undefined>()
  const storageMock = {
    getItem: vi.fn((x) => storageState.get(x)),
    setItem: vi.fn((x, v) => storageState.set(x, v)),
    clear: vi.fn(() => storageState.clear()),
    removeItem: vi.fn((x) => storageState.delete(x))
  }

  const storage = storageMock as any as Storage
  it('string', async () => {
    const vm = useSetup(() => {
      const ref = useStorage(KEY, 'a', storage)
      return { ref }
    })

    expect(vm.ref).toBe('a')
    expect(storage.setItem).toBeCalledWith(KEY, 'a')

    vm.ref = 'b'
    await nextTwoTick()
    expect(storage.setItem).toBeCalledWith(KEY, 'b')
  })

  it('number', async () => {
    storageState.set(KEY, '0')
    const store = useStorage(KEY, 1, storage)
    // expect(store.value).toBe(0)

    store.value = 2
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '2')

    store.value = -1
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '-1')

    store.value = 2.4
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '2.4')
  })

  it('boolean', async () => {
    const store = useStorage(KEY, true, storage)
    expect(store.value).toBe(true)

    store.value = false
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, 'false')

    store.value = true
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, 'true')
  })

  it('null string', async () => {
    storage.setItem(KEY, 'null')
    const store = useStorage(KEY, 'null', storage)
    const storedValue = storage.getItem(KEY)

    expect(store.value).toBe('null')
    expect(storedValue).toBe('null')
  })

  it('null value', async () => {
    storage.removeItem(KEY)
    const store = useStorage(KEY, null, storage)
    const storedValue = storage.getItem(KEY)

    expect(store.value).toBe(null)
    expect(storedValue).toBeFalsy()
  })

  it('undefined value', async () => {
    storage.removeItem(KEY)
    const store = useStorage(KEY, undefined, storage)
    const storedValue = storage.getItem(KEY)

    expect(store.value).toBe(undefined)
    expect(storage.getItem(KEY)).toBe(undefined)
    expect(storedValue).toBeFalsy()
  })

  it('remove', async () => {
    const store = useStorage(KEY, null, storage)
    store.value = null
    expect(store.value).toBe(null)
    expect(storage.getItem(KEY)).toBeFalsy()
  })

  it('date', async () => {
    const store = useStorage(KEY, new Date('2024-09-18T06:11:31.115Z'), storage)
    expect(store.value).toEqual(new Date('2024-09-18T06:11:31.115Z'))

    expect(storage.setItem).toHaveBeenCalledWith(KEY, '2024-09-18T06:11:31.115Z')
  })

  it('object', async () => {
    storage.removeItem(KEY)
    const store = useStorage(KEY, {
      name: 'a',
      data: 123,
    }, storage)

    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"a","data":123}')

    store.value.name = 'b'
    await nextTwoTick()
    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":123}')

    store.value.data = 233
    await nextTwoTick()
    expect(storage.setItem).toBeCalledWith(KEY, '{"name":"b","data":233}')

    store.value = null
    await nextTwoTick()
    expect(storage.removeItem).toBeCalledWith(KEY)
  })

  it('map', async () => {
    const store = useStorage(KEY, new Map<number, string | number>([
      [1, 'a'],
      [2, 2],
    ]), storage)

    expect(storage.setItem).toBeCalledWith(KEY, '[[1,"a"],[2,2]]')

    expect(store.value).toEqual(new Map<number, string | number>([[1, 'a'], [2, 2]]))

    store.value.set(1, 'c')
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '[[1,"c"],[2,2]]')

    store.value.set(2, 3)
    await nextTwoTick()

    expect(storage.setItem).toBeCalledWith(KEY, '[[1,"c"],[2,3]]')

    store.value = null
    await nextTwoTick()

    expect(storage.removeItem).toBeCalledWith(KEY)
  })

  it('set', async () => {
    const store = useStorage(KEY, new Set<string | number>([1, '2']), storage)

    expect(storage.setItem).toHaveBeenCalledWith(KEY, '[1,"2"]')
    expect(store.value).toEqual(new Set([1, '2']))

    store.value.add(3)
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '[1,"2",3]')
  })

  it('should work with ref value', async () => {
    storage.removeItem(KEY)
    const obj = ref({ name: 'phil', age: 27 })
    const state = useStorage(KEY, obj, storage)
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '{"name":"phil","age":27}')
    expect(state).toEqual(obj)
    obj.value.age = 28
    await nextTwoTick()
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '{"name":"phil","age":28}')
  })

  it('eventFilter', async () => {
    storage.removeItem(KEY)
    const vm = useSetup(() => {
      const ref = useStorage(KEY, { name: 'phil', age: 24 }, storage, { eventFilter: debounceFilter(300) })


      return {
        ref
      }
    })

    await promiseTimeout(300)
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '{"name":"phil","age":24}')

    vm.ref.name = 'phil01'
    await nextTwoTick()
    await promiseTimeout(200)
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '{"name":"phil","age":24}')
    await promiseTimeout(100)
    expect(storage.setItem).toHaveBeenCalledWith(KEY, '{"name":"phil01","age":24}')
  })

  it('support shallow ref', async () => {
    storage.removeItem(KEY)
    const data = useStorage(KEY, 0, storage, { shallow: true })
    expect(data.value).toBe(0)

    data.value = 1
    await nextTwoTick()
    expect(data.value).toBe(1)
    expect(storage.getItem(KEY)).toBe('1')
  })

  it('merge defaults', () => {
    // const basicRef = useStorage(KEY, 1, storage, { mergeDefaults: true })
    // expect(basicRef.value).toBe(1)

    storage.setItem(KEY, JSON.stringify({ a: 1 }))
    const objectRef = useStorage(KEY, { a: 2, b: 3 }, storage, { mergeDefaults: true })
    expect(objectRef.value).toEqual({ a: 1, b: 3 })
  })

  it('watch storage event', async () => {
    const data = useStorage(KEY, 0, localStorage)
    expect(data.value).toBe(0)

    window.dispatchEvent(new StorageEvent('storage'))
    await nextTwoTick()
    expect(data.value).toBe(0)

    data.value = 1
    await nextTwoTick()
    expect(data.value).toBe(1)
    window.dispatchEvent(new StorageEvent('storage', { storageArea: localStorage }))
    await nextTwoTick()
    expect(data.value).toBe(0)

    window.dispatchEvent(new StorageEvent('storage', { storageArea: localStorage, key: KEY, newValue: '1' }))
    await nextTwoTick()
    expect(data.value).toBe(1)
  })

  it('handle Error', () => {
    storage.removeItem(KEY)
    // expect(useStorage(KEY, 0, storage).value).toBe(0)
    // expect(console.error).toHaveBeenCalledWith(new Error('getDefaultStorage error'))

    const ref = useStorage(KEY, 0, ({
      getItem: () => null,
      setItem: () => { throw new Error('write item error') }
    }) as unknown as Storage)
    expect(ref.value).toBe(0)
    ref.value = 1
    expect(console.error).toHaveBeenCalledWith(new Error('write item error'))
  })

  it('emit custom storage event on change', () => {

  })


})