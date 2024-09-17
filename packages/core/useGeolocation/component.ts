import { defineComponent, reactive } from "vue";
import { useGeoLocation } from ".";


export const UseGeolocation = defineComponent({
  props: [ 'immediate', 'timeout', 'maximumAge', 'enableHighAccuracy' ],
  setup(props, { slots })  {
    const data = reactive(useGeoLocation(props))

    return () => {
      if ( slots.default ) {
        return slots.default(data)
      }
    }
  }
})