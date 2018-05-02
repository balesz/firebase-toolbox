
export function lazy<T>(call: () => T): () => T {
  let value: T | undefined = undefined
  return () => {
    if (!value) value = call()
    return value as T
  }
}
