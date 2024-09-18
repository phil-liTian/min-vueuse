import { Serializer } from "."

export function guessSerializerType<T>(rawInit: T) {
  return rawInit == null ? 'any' : rawInit instanceof Map ? 'map' : rawInit instanceof Set ? 'set' : rawInit instanceof Date ? 'date' : typeof rawInit === 'string' ? 'string' : typeof rawInit === 'boolean' ? 'boolean' : typeof rawInit === 'object' ? 'object' : typeof rawInit === 'number' ? 'number' : 'any'
}

export const StorageSerializers: Record<string, Serializer<any>> = {
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v)
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v)
  },
  boolean: {
    read: (v: any) => Boolean(v),
    write: (v: any) => String(v)
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v)
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: Date) => v.toISOString()
  },
  object: {
    write: (v: any) => JSON.stringify(v),
    read: (v: any) => JSON.parse(v)
  },
  map: {
    write: (v: any) => JSON.stringify(Array.from(v.entries())),
    read: (v: any) => new Map(JSON.parse(v))
  },
  set: {
    write: (v: any) => JSON.stringify(Array.from(v)),
    read: (v: any) => new Set(JSON.parse(v))
  }
}
