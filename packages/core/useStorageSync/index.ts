import { MaybeRefOrGetter, RemovableRef, toValue, watchWithFilter } from "@mini-vueuse/shared";
import { UseStorageOptions } from "..";
import { ref, shallowRef } from "vue";
import { guessSerializerType, StorageSerializers } from "../useStorage/serializer";


export function useStorageSync<T extends (string | number | object | null | boolean)>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  storage: Storage = window.localStorage,
  options: UseStorageOptions<T> = {}
): RemovableRef<T> {

  const {
    deep = true,
    flush = 'pre',
    listenToStorageChanged = true,
    mergeDefaults = true,
    onError = err => console.error(err),
    shallow = false,
    writeDefaults = true,
    eventFilter
  } = options
  const rawInit = toValue(initialValue)

  const type = guessSerializerType<T>(rawInit)
  const data = (shallow ? shallowRef : ref)(rawInit)
  const serializer = options.serializer ?? StorageSerializers[type]

  function read(event?: StorageEvent) {
    console.log('event', event);
    if (!storage || (event && event.key !== key))
      return
    try {
      const rawValue = event ? event.newValue : storage.getItem(key)
      if (rawValue == null) {
        // 初始化时没有event和storage.getItem(key)
        // 需要执行写操作
        if (rawInit != null) {
          storage.setItem(key, serializer.write(rawInit))
        }

        return rawInit
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue)
        if (type === 'object' && !Array.isArray(value)) {
          return { ...(rawInit as any), ...value }
        }
        return value
      } else if (typeof rawValue !== 'string') {
        return rawValue
      }
      return serializer.read(rawValue)

    } catch (error) {
      onError(error)
    }
  }

  read()

  if (storage) {
    watchWithFilter(data, async () => {
      try {
        if (data.value == null) {
          await storage.removeItem(key)
        } else {
          await storage.setItem(key, await serializer.write(data.value))
        }
      } catch (e) {
        onError(e)
      }
    }, { deep, flush, eventFilter })
  }



  return data as RemovableRef<T>
}