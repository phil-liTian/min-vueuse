import { Ref, ref, shallowRef, warn } from "vue";
import { ConfigableNavigator, defaultNavigator } from "../_configurable";
import useSupported from "../useSupported";

export interface UseGeolocationOptions extends ConfigableNavigator {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  immediate?: boolean;
}


export function useGeoLocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    navigator = defaultNavigator,
    maximumAge = 30000,
    timeout = 27000,
    immediate = true
  } = options

  const locatedAt = ref<number | null>(null)
  const isSupported = useSupported(() => navigator && 'geolocation' in navigator)
  const error = shallowRef<GeolocationPositionError | null>(null)
  let watcher: number | undefined

  const coords: Ref<GeolocationPosition['coords']> = ref({
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.NEGATIVE_INFINITY,
    accuracy: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  })

  function updatePosition(position: GeolocationPosition) {
    coords.value = position.coords
    locatedAt.value = position.timestamp
    error.value = null
  }

  function resume() {
    if ( isSupported.value ) {
      // 用于持续跟踪设备的地理位置变化
      watcher = navigator?.geolocation.watchPosition(
        updatePosition,
        err => {
          console.log('err', err);
          
          error.value = err
        },
        {
          enableHighAccuracy,
          maximumAge,
          timeout
        }
      )
    }
  }

  if ( immediate )
    resume()

  function pause() {
    if ( watcher && navigator ) 
      navigator.geolocation.clearWatch(watcher)
  }

  return {
    isSupported,
    coords,
    locatedAt,
    error,

    resume,
    pause,
  }
}