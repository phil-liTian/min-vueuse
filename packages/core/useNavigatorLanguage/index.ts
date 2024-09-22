import { ref, Ref } from 'vue'
import { ConfigableWindow, defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import useSupported from '../useSupported'

export interface NavigatorLanguageState {
  isSupport: Ref<boolean>

  language: Ref<string | undefined>
}

export function useNavigatorLanguage(options: ConfigableWindow = {}): NavigatorLanguageState {
  const { window = defaultWindow } = options

  const navigator = window?.navigator
  const isSupport = useSupported(() => navigator && 'language' in navigator)
  const language = ref<string | undefined>(navigator?.language)

  useEventListener(window, 'languagechange', () => {
    language.value = navigator?.language
  })

  return {
    isSupport,
    language
  }
}
