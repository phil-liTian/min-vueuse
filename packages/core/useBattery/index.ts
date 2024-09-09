import { ref } from "vue";
import useSupported from "../useSupported";
import { useEventListener } from "../useEventListener";

export interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number
}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<BatteryManager>
}


export function useBattery() {
  const events = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange']
  let battery: BatteryManager | null
  const isSupported = useSupported(() => typeof navigator !== 'undefined' && 'getBattery' in navigator && typeof navigator.getBattery === 'function')  

  let charging = ref(false)
  let chargingTime = ref(0)
  let dischargingTime = ref(0)
  let level = ref(0)

  function updateBatteryInfo(battery: BatteryManager) {
    charging.value = battery.charging
    chargingTime.value = battery.chargingTime
    dischargingTime.value = battery.dischargingTime
    level.value = battery.level
  }

  if ( isSupported.value ) {
    (navigator as NavigatorWithBattery).getBattery().then(_battery => {
      battery = _battery
      updateBatteryInfo(battery)
      useEventListener(battery, events, updateBatteryInfo, { passive: false })
    })
  }

  return {
    isSupported,
    charging,
    chargingTime,
    dischargingTime,
    level
  }
}