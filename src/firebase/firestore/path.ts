
export const getPathSegments = (path: string) => path
  .split("/")
  .filter(it => it != "")
  .reduce((a: string[], v, i) => [...a, (i + 1) % 2 == 0 ? v : `[${v}]`], [])
