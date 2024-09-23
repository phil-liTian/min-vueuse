export function resolveElement(el: HTMLElement | Window | Document | null | undefined | SVGElement) {
  console.log('el', el)

  if (typeof Window !== 'undefined' && el instanceof Window) {
    return el.document.documentElement
  }

  if (typeof Document !== 'undefined' && el instanceof Document) return el.documentElement

  return el as HTMLElement | SVGElement | undefined | null
}
