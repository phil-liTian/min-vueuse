import { MaybeRefOrGetter } from "@mini-vueuse/shared";
import { ref, watch } from 'vue'

export function useTitle(
  newTitle: MaybeRefOrGetter<string | null> = null,
  options = {}
) {
  const title = ref(newTitle ?? document.title ?? null)
  console.log('a===>', title.value);
  
  watch(title, (t, o) => {
    console.log('t, o', t, o);
    
    if ( t !== o && document ) {
      
      document.title = typeof t === 'string' ? t : ''
    }

  }, { immediate: true })


  return title
}
