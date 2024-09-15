import { computed, ComputedRef, ref, Ref } from "vue";
import useSupported from "../useSupported";
import { ConfigableNavigator, defaultNavigator } from "../_configurable";
import { MaybeRefOrGetter, toValue, useTimeoutFn } from "@mini-vueuse/shared";

export interface UseClipboardOptions<Source> extends ConfigableNavigator {
  source?: Source;

  /**
   * clipboard api 不可用时启用备选方案
   */
  legacy?: boolean; 

  /**
   * 拷贝时长
   */
  copiedDuring?: number;
}

export interface UseClipboardReturn<Optional> {
  isSupported: ComputedRef<boolean>;
  // 
  copy:Optional extends true ? (text?: string) => Promise<void> : (text: string) => Promise<void>;

  copied: Ref<boolean>;
}

export function useClipboard(options?: UseClipboardOptions<MaybeRefOrGetter<undefined>>): UseClipboardReturn<true>
export function useClipboard(options?: UseClipboardOptions<MaybeRefOrGetter<string>>): UseClipboardReturn<false>

/**
 * 如果剪切板api不可用的时候, 用execCommand复制(替代方案)
 * @param options 
 * @returns 
 */
export function useClipboard(options: UseClipboardOptions<MaybeRefOrGetter<string | undefined>> = {}): UseClipboardReturn<boolean> {

  const {
    source,
    navigator = defaultNavigator,
    legacy = false,
    copiedDuring = 2000
  } = options

  const copied = ref(false)
  const text = ref('')

  const isClipboarApiIsSupported = useSupported(() => typeof navigator !== 'undefined' && 'clipboard' in navigator!)
  const isSupported = computed(() => isClipboarApiIsSupported.value || legacy)
  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring)

  async function copy(value = toValue(source)) {
    if ( isSupported.value || value !== undefined ) {
      if ( isClipboarApiIsSupported.value ) {
        // 支持clipboard api
        await navigator?.clipboard.writeText(value!)
      } else {
        legacyCopy(value!)
      }
    }
    copied.value = true
    text.value = value!
    timeout.start()
  }


  // 替补方案
  function legacyCopy(value: string) {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.style.position = 'absolute'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
  
  return {
    isSupported,
    copy,
    copied
  }
}