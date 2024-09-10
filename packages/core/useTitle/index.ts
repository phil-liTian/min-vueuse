import { MaybeRefOrGetter } from "@mini-vueuse/shared";
import { Ref, ref, toRef, watch } from 'vue'
import { ReadonlyRefOrGetter } from '@mini-vueuse/shared'
import type { ConfigableDocument } from '../_configurable'

type UseTitleOptionsBase = {

}


type UseTitleOptions = UseTitleOptionsBase & ConfigableDocument

export function useTitle(
  newTitle: MaybeRefOrGetter<string | null> = null,
  options = {}
) {
  const originalTitle = ref(document?.title ?? '')
  const title: Ref<string | null | undefined> = toRef(newTitle ?? document.title ?? null)
  
  watch(title, (t, o) => {
    if ( t !== o && document ) {
      
      document.title = typeof t === 'string' ? t : ''
    }

  }, { immediate: true })


  return title
}
