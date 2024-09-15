import { MaybeRefOrGetter, toValue, useTimeoutFn } from "@mini-vueuse/shared";
import { useClipboard, UseClipboardOptions, UseClipboardReturn } from "../useClipboard";
import { defaultNavigator } from "../_configurable";
import useSupported from "../useSupported";
import { Ref, ref } from "vue";

export interface UseClipboardItemsOptions<Source> extends Omit<UseClipboardOptions<Source>, 'legacy'> {

}

export interface UseClipboardItemsReturn<Optional> extends Omit<UseClipboardReturn<Optional>, 'copy'> {

  copy: Optional extends true ? (items: ClipboardItems) => Promise<void> : (items?: ClipboardItems) => Promise<void>,
  content: Ref<ClipboardItems>
}

export function useClipboardItems (options?: UseClipboardOptions<MaybeRefOrGetter<ClipboardItems>>): UseClipboardItemsReturn<true>

export function useClipboardItems (options?: UseClipboardItemsOptions<undefined>): UseClipboardItemsReturn<false>

export function useClipboardItems (options: UseClipboardItemsOptions<MaybeRefOrGetter<ClipboardItems> | undefined> = {}): UseClipboardItemsReturn<boolean> {
  const {
    source,
    navigator = defaultNavigator,
    copiedDuring = 1500
  } = options

  const isSupported  = useSupported(() => typeof navigator !== 'undefined' && 'clipboard' in navigator!)
  const copied = ref(false)
  const content = ref<ClipboardItems>([])
  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring)

  async function copy (value = toValue(source)) {
    if ( isSupported.value && value !== null ) {
      await navigator!.clipboard.write(value!)

      copied.value = true
      content.value = value!
      timeout.start()
    }
  }


  return {
    isSupported,
    copied,
    content: content as Ref<ClipboardItems>,
    copy
  }
}