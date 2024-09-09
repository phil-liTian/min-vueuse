import { useIntervalFn } from "@mini-vueuse/shared";
import { computed, ref } from "vue";

export interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

type PerformanceType = Performance & { memory: MemoryInfo }

export function useMemory() {
  const memory = ref<MemoryInfo>()
  const isSupported = computed(() => typeof performance !== 'undefined' && ('memory' in performance) )

  if ( isSupported.value ) {
    useIntervalFn(() => {
      memory.value = (performance as PerformanceType).memory
    }, 1000)
  }

  return { isSupported, memory }
}
