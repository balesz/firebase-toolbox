import {
  isEmpty,
  isNil,
  keys,
  lensPath,
  not,
  omit,
  pair,
  pipe,
  view,
} from "ramda"

import {
  getPathSegments,
  isCollectionPath,
  isPathExists,
  matchCollectionName,
} from "./path"

////////////////////////////////////////////////////////////////////////////////

type Data = {[key: string]: any}

////////////////////////////////////////////////////////////////////////////////

export async function restoreFirestore(path: string, data: Data) {
  _checkError(path, data)
  if (path == "/") {
    await _restoreDocument("", data)
  } else {
    const objPath = getPathSegments(path).join("/")
    const value = view(lensPath(getPathSegments(path)), data)
    const func = isCollectionPath(path) ? _restoreCollection : _restoreDocument
    await func(objPath, value)
  }
  return _writeChanges()
}

////////////////////////////////////////////////////////////////////////////////

function _checkError(path: string, data: Data) {
  if (!data) {
    throw Error("Data parameter is nil!!")
  } else if (!isPathExists(path, data)) {
    throw Error("The path is not in the data!!")
  }
}

async function _restoreCollection(path: string, data: Data) {
  for (const key in data)
    await _restoreDocument(`${path}/${key}`, data[key])
}

async function _restoreDocument(path: string, data: Data) {
  const colls = keys(data).filter(pipe(matchCollectionName, isEmpty, not))
  await _setDocument(path, omit(colls, data))
  for (const key of colls)
    await _restoreCollection(`${path}/${key}`, data[key])
}

////////////////////////////////////////////////////////////////////////////////

let result: [string, Data][] | undefined

async function _setDocument(path: string, data: Data) {
  if (isEmpty(data)) return
  if (isNil(result)) result = []
  result.push(pair(path, data))
}

async function _writeChanges() {
  const resultSize = result!.length
  const ret = [...result!]
  result = undefined
  return ret
}
