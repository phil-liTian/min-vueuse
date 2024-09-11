import { ComputedRef, Ref, ref } from "vue";
import { ConfigableWindow, defaultWindow } from "../_configurable";
import { useEventListener } from "../useEventListener";
import useSupported from "../useSupported";

export type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'

export type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined



export type NetworkState = {
  isSupported: ComputedRef<boolean>;

  onlineAt: Ref<number | null>;

  offlineAt: Ref<number | null>;

  downlink: Ref<number | null>;

  downlinkMax: Ref<number | null>;

  effectiveType: Ref<NetworkEffectiveType | undefined>

  rtt: Ref<number | undefined>;

  saveData: Ref<boolean | null>;

  type: Ref<NetworkType>;

  isOnline: Ref<boolean>
}

export function useNetwork(options: ConfigableWindow = {}): Readonly<NetworkState> {
  const { window = defaultWindow } = options

  const isOnline = ref(true)
  const saveData = ref(false)
  const onlineAt: Ref<number | null> = ref(null)
  const offlineAt: Ref<number | null> = ref(null)
  const navigator = window?.navigator
  const isSupported = useSupported(() => navigator && 'connection' in navigator)
  const downlink: Ref<number | null> = ref(null)
  const downlinkMax: Ref<number | null> = ref(null)
  const rtt: Ref<number | undefined> = ref(undefined)
  const effectiveType: Ref<NetworkEffectiveType> = ref(undefined)
  const type: Ref<NetworkType> = ref<NetworkType>('unknown')

  const connection = isSupported.value && (navigator as any).connection

  function updateNetworkInformation() {
    if ( !navigator ) return

    if ( connection ) {
      downlink.value = connection.downlink
      downlinkMax.value = connection.downlinkMax
      effectiveType.value = connection.effectiveType
      rtt.value = connection.rtt
      saveData.value = connection.saveData
      type.value = connection.type
    }
  }


  if ( window ) {
    useEventListener(window, 'offline', () => {
      isOnline.value = false
      offlineAt.value = Date.now()
    })

    useEventListener(window, 'online', () => {
      isOnline.value = true
      onlineAt.value = Date.now()
    })
  }

  if ( connection ) {

  }


  updateNetworkInformation()

  return {
    isSupported,
    isOnline,
    saveData,
    offlineAt,
    onlineAt,
    downlink,
    downlinkMax,
    effectiveType,
    rtt,
    type,
  }
}