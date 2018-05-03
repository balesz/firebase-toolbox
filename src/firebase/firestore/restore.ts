import {isEmpty, isNil, keys, length, lensPath, omit, pair, view} from "ramda"

import {ProgressEvent} from "./event"
import {Path} from "./path"

////////////////////////////////////////////////////////////////////////////////

type Data = {[key: string]: any}

////////////////////////////////////////////////////////////////////////////////

export const restoreProgress = new ProgressEvent()

export async function restoreFirestore(destPath: string, data: Data) {
  const path = new Path(destPath)
  _checkError(path, data)
  const lens = lensPath(path.objectArray)
  if (path.isEmpty) {
    await _restoreDocument(path, data)
  } else if (path.isCollection) {
    await _restoreCollection(path, view(lens, data))
  } else {
    restoreProgress.emitSize(1)
    await _restoreDocument(path, view(lens, data))
  }
  restoreProgress.removeAllListeners()
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
  restoreProgress.emitSize(length(keys(data)))
  for (const key in data) {
    await _restoreDocument(new Path(path.toString(key)), data[key])
  }
}

async function _restoreDocument(path: Path, data: Data) {
  const colls = keys(data).filter(Path.isCollectionKey)
  await _setDocument(path, omit(colls, data))
  restoreProgress.emitStep(path.reference)
  for (const key of colls) {
    await _restoreCollection(new Path(path.toString(key)), data[key])
  }
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
