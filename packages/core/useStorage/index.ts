import { ConfigableEventFilter, ConfigurableFlush, MaybeRefOrGetter, noop, pausableFilter, toValue, tryOnMounted } from "@mini-vueuse/shared";
import { useEventListener } from "../useEventListener";
import { ref, shallowRef, watch } from "vue";
import { watchPausable } from "@mini-vueuse/shared/watchPausable";
import { guessSerializerType, StorageSerializers } from "./serializer";
import { ConfigableWindow, defaultWindow } from "../_configurable";

export interface Serializer<T> {
  read: (raw: string) => T,
  write: (value: T) => string
}

export interface StorageEventLike {
  key: StorageEvent['key'],
  oldValue: StorageEvent['oldValue'],
  newValue: StorageEvent['newValue'],
  storageArea: StorageEvent['storageArea']
}

export const customStorageEventName = 'vueuse-storage'


export interface UseStorageOptions<T> extends ConfigurableFlush, ConfigableWindow, ConfigableEventFilter {
  deep?: boolean;

  // 控制是否在组件创建后运行storage, default: false
  initOnMounted?: boolean;

  // 自定义序列化函数
  serializer?: Serializer<T>;

  listenToStorageChanged?: boolean;

  // 默认合并选项
  mergeDefaults?: boolean;

  writeDefaults?: boolean;

  shallow?: boolean;

  onError?: (error: unknown) => void
}

export function useStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: Storage = window.localStorage,
  options: UseStorageOptions<T> = {},
) {
  const {
    initOnMounted,
    listenToStorageChanged = true,
    flush = 'pre',
    deep = true,
    eventFilter,
    shallow,
    window = defaultWindow,
    writeDefaults = true,
    mergeDefaults = false,
    onError = (e) => console.error(e)
  } = options
  const rawInit: T = toValue(defaults)
  const type = guessSerializerType<T>(rawInit)
  // 支持自定义serializer
  const serializer = options.serializer ?? StorageSerializers[type]

  // 需要是一个ref对象， 用于watch监听
  const data = (shallow ? shallowRef : ref)(typeof defaults === 'function' ? (defaults as Function)() : ref(defaults))
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, () => write(data.value), { flush, deep, eventFilter })

  if (window && listenToStorageChanged) {
    tryOnMounted(() => {
      if (storage instanceof Storage) {
        useEventListener(window, 'storage', update)
      } else {
        // 自定义storage
        useEventListener(window, customStorageEventName, updateFromCustomEvent)
      }
    })
  }

  function dispatchWriteEvent(oldValue: string | null, newValue: string | null) {
    if (window) {

      const payload: StorageEventLike = {
        key,
        oldValue,
        newValue,
        storageArea: storage as Storage
      }

      window.dispatchEvent(storage instanceof Storage ? new StorageEvent('storage', payload) : new CustomEvent<StorageEventLike>(customStorageEventName, { detail: payload }))
    }
  }

  // 写到storage中
  function write(v: unknown) {
    try {
      const oldValue = storage.getItem(key)
      if (v == null && writeDefaults) {
        // 匹配 null和undefined
        storage.removeItem(key)
      } else {
        const serialized = serializer.write(v as any)

        // 写操作
        if (oldValue !== serialized) {
          storage.setItem(key, serialized)
          dispatchWriteEvent(oldValue, serialized)
        }
      }
    } catch (e) {
      onError(e)
    }
  }

  // 读取storage中的值
  function read(event?: StorageEventLike) {
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
        return { ...rawInit, ...value }
      }
      return value
    } else if (typeof rawValue !== 'string') {
      return rawValue
    }
    return serializer.read(rawValue)
  }

  function update(event?: StorageEventLike) {
    if (event) {
      if (event.storageArea !== storage) return

      if (event.key === null) {
        data.value = rawInit
        return
      }

      if (event.key !== key) return
    }

    pauseWatch()

    try {
      if (event?.newValue !== serializer.write(data.value)) {
        data.value = read(event)
      }
    } catch (e) {

    } finally {
      resumeWatch()
    }
  }

  if (!initOnMounted) {
    update()
  }

  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event?.detail)
  }


  return data
}
