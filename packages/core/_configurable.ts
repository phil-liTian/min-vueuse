export interface ConfigableDocument {
  document?: Document
}

export interface ConfigableWindow {
  window?: Window
}

export interface ConfigableNavigator {
  navigator?: Navigator
}

export interface ConfigableDocumentOrShadowRoot {
  document?: DocumentOrShadowRoot
}

export const defaultWindow = typeof window !== 'undefined' ? window : null
export const defaultDocument = typeof document !== 'undefined' ? document : null
export const defaultNavigator = typeof navigator !== 'undefined' ? navigator : null
