import { useNetwork } from '@mini-vueuse/core'
import { ConfigableWindow } from '@mini-vueuse/core/_configurable'
export function useOnline(options: ConfigableWindow = {}) {
  const { isOnline } = useNetwork(options)
  return isOnline
}