import {
  addIndex,
  isEmpty,
  last,
  map,
  match,
  not,
  pipe,
  reject,
  split,
} from "ramda"

const matchCollection = match(/\__.*\__/)

export const getPathSegments = pipe(
  split("/"), it => reject(el => el == "", it),
  addIndex(map)((it, idx) => (idx + 1) % 2 == 0 ? `${it}` : `__${it}__`),
  map(it => it as string)
)

export const isCollectionPath = pipe(
  getPathSegments, last, matchCollection, isEmpty, not
)
