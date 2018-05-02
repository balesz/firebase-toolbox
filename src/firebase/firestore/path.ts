import {
  addIndex,
  equals,
  isEmpty,
  isNil,
  last,
  lensPath,
  map,
  match,
  not,
  pipe,
  reject,
  split,
  view,
} from "ramda"

export const matchCollectionName = match(/\__.*\__/)

export const getPathSegments = pipe(
  split("/"), it => reject(el => el == "", it),
  addIndex(map)((it, idx) => (idx + 1) % 2 == 0 ? `${it}` : `__${it}__`),
  map(it => it as string)
)

export const isCollectionPath = pipe(
  getPathSegments, last, matchCollectionName, isEmpty, not
)

export const isPathExists = (path: string, data: any) => !!path && (
  equals("/", path) || pipe(
    getPathSegments, lensPath, it => view(it)(data), isNil, not
  )(path)
)
