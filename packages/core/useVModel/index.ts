import { isDef } from "@mini-vueuse/shared";
import { computed, getCurrentInstance, Ref, ref, watch, WritableComputedRef } from "vue";
import { CloneFn, cloneFnJson } from "../useCloned";

export interface UseVModelOptions<T, Passive extends boolean = false> {
  /**
   * 事件名
   */
  eventName?: string;

  /**
   * why: add passive?
   * 因为如果想要实现双向绑定的是简单数据类型, 则会触发setter。但是如果双向绑定的是一个对象, 则不会触发setter,
   * 此时可利用watch来监听数据的变化 
   */
  passive?: Passive;

  /**
   * 配合passive使用
   * default: false
   */
  deep?: boolean;

  defaultValue?: T;

  /**
   * clone
   */
  clone?: boolean | CloneFn<T>;

  shouldEmit?: (v: T) => boolean
}

export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options?: UseVModelOptions<P[K], true>
): Ref<P[K]>

export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options?: UseVModelOptions<P[K], false>
): WritableComputedRef<P[K]>


export function useVModel<P extends object, K extends keyof P, Name extends string, Passive extends boolean>(
    props: P, 
    key?: K, 
    emit?: (name: Name, ...args: any[]) => void,
    options: UseVModelOptions<P[K], Passive> = {}
  ) {

  const {
    eventName,
    passive = false,
    deep = false,
    defaultValue,
    shouldEmit,
    clone = false
  } = options
  const vm = getCurrentInstance()

  // @ts-ignore
  const _emit = emit || vm?.emit || vm?.$emits.bind(vm) || vm?.proxy?.$emit.bind(vm.proxy)

  let event: string | undefined = eventName

  if ( !key )
    key = 'modelValue' as K

  event = event || `update:${key.toString()}`

  const cloneFn = value => clone ? (typeof clone === 'function' ? clone(value) : cloneFnJson(value)) : value

  function getValue() {
    return isDef(props[key!]) ? cloneFn(props[key!]) : defaultValue
  }

  function triggerEvent(value: P[K]) {
    if ( shouldEmit ) {
      if ( shouldEmit(value) ) {
        _emit(event, value)
      }
    } else {
      _emit(event, value)
    }
  }
  
  if ( passive ) {
    const initialValue = getValue()
    const proxy = ref<P[K]>(initialValue)
    let isUpdating = false


    // watch(() => props[key], (v) => {
    //   console.log('v--->', v);
    // })


    watch(proxy, v => {
      if ( (deep || v !== props[key!]) && !isUpdating ) {
        triggerEvent(v as P[K])
      }
    }, { deep })

    return proxy
  }

  return computed<P[K]>({
    get() {
      return getValue()
    },
    set(val) {
      triggerEvent(val)
    }
  })
}