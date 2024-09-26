export function reactivePick<T extends object, K extends keyof T>(obj: T, ...keys: (K | K[])[]) {}
