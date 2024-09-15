import { Ref, shallowRef } from "vue"
import { ConfigableNavigator, defaultNavigator } from "../_configurable"
import { createSingletonPromise } from "@mini-vueuse/shared"
import useSupported from "../useSupported"
import { useEventListener } from "../useEventListener"
/**
 * 获取权限授予状态, 可返回PermissionState状态, 包含同意: granted; 拒绝: denied; 提示: prompt
 * 剪切板
 * 摄像头
 * 通知权限
 * 在网络连接恢复时自动同步未完成的任务
 * 麦克风权限
 * 地理位置
 * 访问设备加速度传感器
 */

type DescriptorNamePolyfill = 
  'clipboard-read' | 'clipboard-write' | 'camera' | 'notifications' | 'background-sync' | 'microphone' | 'geolocation' | 'accelerometer'


export type GeneralPermissionDescriptor = PermissionDescriptor | {
  name: DescriptorNamePolyfill
}

export interface UsePermissionOptions<Controls extends boolean> extends ConfigableNavigator {
  controls?: Controls
}

export type UsePermissionReturn = Readonly<Ref<PermissionState | undefined>>

export type UsePermissionReturnWithControls = {
  state: UsePermissionReturn,
  isSupport: Ref<boolean>,
  query: () => Promise<undefined | PermissionStatus>
}

export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options?: UsePermissionOptions<false>
): UsePermissionReturn

export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options?: UsePermissionOptions<true>
): UsePermissionReturnWithControls

export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options: UsePermissionOptions<boolean> = {}
): UsePermissionReturn | UsePermissionReturnWithControls {
  const {
    controls = false,
    navigator = defaultNavigator
  } = options
  const isSupported = useSupported(() => navigator && 'permissions' in navigator)

  const desc = typeof permissionDesc === 'string' ? { name: permissionDesc } as PermissionDescriptor : permissionDesc as PermissionDescriptor

  const permissionStatus = shallowRef<PermissionStatus>()
  // 授权状态 denied" | "granted" | "prompt"
  const state = shallowRef<PermissionState | undefined>()

  const update = () => {
    state.value = permissionStatus.value?.state
  }

  // useEventListener(permissionStatus, 'change', update)

  // 单例模式
  const query = createSingletonPromise(async () => {
    if ( !isSupported.value )
      return

    if ( !permissionStatus.value ) {
      try {
        permissionStatus.value = await navigator!.permissions.query(desc)
      } catch (e) {
        permissionStatus.value = undefined
      } finally {
        update()
      }
    }

    if ( controls ) {
      return permissionStatus.value
    }
  })
  
  query()

  if ( controls ) {
    return {
      state,
      isSupport: isSupported,
      query
    }
  } else {
    return state
  }

}