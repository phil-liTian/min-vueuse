
export interface ConfigableDocument {
  document?: Document
}

export interface ConfigableWindow {
  window?: Window
}


export const defaultWindow = typeof window !== 'undefined' ? window : null
export const defaultDocument = typeof document !== 'undefined' ? document : null
