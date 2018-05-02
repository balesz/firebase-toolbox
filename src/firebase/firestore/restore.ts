import {isEmpty, isNil, keys, lensPath, omit, pair, view} from "ramda"

import {Path} from "./path"

////////////////////////////////////////////////////////////////////////////////

type Data = {[key: string]: any}

////////////////////////////////////////////////////////////////////////////////

export async function restoreFirestore(destPath: string, data: Data) {
  const path = new Path(destPath)
  _checkError(path, data)
  if (path.isEmpty) {
    await _restoreDocument(path, data)
  } else {
    const func = path.isCollection ? _restoreCollection : _restoreDocument
    await func(path, view(lensPath(path.objectArray), data))
  }
  return _writeChanges()
}

////////////////////////////////////////////////////////////////////////////////

function _checkError(path: Path, data: Data) {
  if (!data) {
    throw Error("Data parameter is nil!!")
  } else if (!path.isExistsIn(data)) {
    throw Error("The path is not in the data!!")
  }
}

async function _restoreCollection(path: Path, data: Data) {
  for (const key in data)
    await _restoreDocument(new Path(path.toString(key)), data[key])
}

async function _restoreDocument(path: Path, data: Data) {
  const colls = keys(data).filter(Path.isCollectionKey)
  await _setDocument(path, omit(colls, data))
  for (const key of colls)
    await _restoreCollection(new Path(path.toString(key)), data[key])
}

////////////////////////////////////////////////////////////////////////////////

let result: [string, Data][] | undefined

async function _setDocument(path: Path, data: Data) {
  if (isEmpty(data)) return
  if (isNil(result)) result = []
  result.push(pair(path.reference, data))
}

async function _writeChanges() {
  const resultSize = result ? result.length : 0
  const ret = [...result || []]
  result = undefined
  return ret
}
