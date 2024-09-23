import { computed, reactive, ref } from 'vue'
import { useEventListener } from '../useEventListener'
import { MaybeElementRef } from '../unrefElement'
import { defaultWindow } from '../_configurable'
import { MaybeRefOrGetter, noop, toValue } from '@mini-vueuse/shared'
import { DefaultMagicKeysAliasMap } from './aliasMap'

export interface UseMagicKeysOptions<Reactive extends boolean> {
  reactive?: Reactive
  target?: MaybeRefOrGetter<EventTarget>
  onEventFired?: (e: KeyboardEvent) => void | boolean
  aliasMap?: Record<string, string>
}

export function useMagicKeys(options: UseMagicKeysOptions<boolean> = {}): any {
  const {
    reactive: useReactive = false,
    target = defaultWindow,
    onEventFired = noop,
    aliasMap = DefaultMagicKeysAliasMap
  } = options

  const current = reactive(new Set<string>())
  const obj = {
    current
  }
  const refs: Record<string, any> = useReactive ? reactive(obj) : obj
  const usedKeys = new Set<string>()

  function reset() {
    current.clear()
    for (const key of usedKeys) {
      setRefs(key, false)
    }
  }

  function setRefs(key: string, value: boolean) {
    if (key in refs) {
      if (useReactive) {
        refs[key] = value
      } else {
        refs[key].value = value
      }
    }
  }

  function updateRefs(e: KeyboardEvent, value: boolean) {
    const key = e.key?.toLowerCase()
    const code = e.code?.toLowerCase()
    const values = [key, code].filter(Boolean)

    if (key) {
      // keydown添加 keyup移除
      if (value) {
        current.add(key)
      } else {
        current.delete(key)
      }
    }

    // 批量处理refs中props的状态
    for (const key of values) {
      usedKeys.add(key)
      setRefs(key, value)
    }
  }

  useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    updateRefs(e, true)
    return onEventFired(e)
  })

  useEventListener(target, 'keyup', (e: KeyboardEvent) => {
    updateRefs(e, false)
    return onEventFired(e)
  })

  useEventListener('blur', reset)
  useEventListener('focus', reset)

  const proxy = new Proxy(refs, {
    get(target, prop, rec) {
      if (typeof prop !== 'string') return Reflect.get(target, prop, rec)

      prop = prop.toLowerCase()
      if (!(prop in refs)) {
        if (aliasMap[prop]) prop = aliasMap[prop] as string
        // 初始化 将ref的props都设置成false
        if (/[+_-]/.test(prop)) {
          const keys = prop.split(/[+_-]/g).map((i) => i.trim())
          refs[prop] = computed(() => keys.every((key) => toValue(proxy[key])))
        } else {
          refs[prop] = ref(false)
        }
      }

      const r = Reflect.get(target, prop, rec)
      return useReactive ? toValue(r) : r
    }
  })

  return proxy
}
