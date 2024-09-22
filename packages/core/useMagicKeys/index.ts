import { reactive, ref } from 'vue'
import { useEventListener } from '../useEventListener'
import { MaybeElementRef } from '../unrefElement'
import { defaultWindow } from '../_configurable'
import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'

export interface UseMagicKeysOptions<Reactive extends boolean> {
  reactive?: Reactive
  target?: MaybeRefOrGetter<EventTarget>
}

export function useMagicKeys(options: UseMagicKeysOptions<boolean> = {}): any {
  const { reactive: useReactive = false, target = defaultWindow } = options

  const current = reactive(new Set())
  const obj = {
    current
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
      setRefs(key, value)
    }
  }

  const refs: Record<string, any> = useReactive ? reactive(obj) : obj

  useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    updateRefs(e, true)
  })

  useEventListener(target, 'keyup', (e: KeyboardEvent) => {
    updateRefs(e, false)
  })

  const proxy = new Proxy(refs, {
    get(target, prop, rec) {
      if (typeof prop !== 'string') return Reflect.get(target, prop, rec)

      prop = prop.toLowerCase()
      if (!(prop in refs)) {
        console.log('prop', prop)
        // 初始化 将ref的props都设置成false
        refs[prop] = ref(false)
        // if ( ) {
        // } else {
        //   ref
        // }
      }

      const r = Reflect.get(target, prop, rec)
      return useReactive ? toValue(r) : r
    }
  })

  return proxy
}
