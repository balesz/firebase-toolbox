import {assocPath, mergeDeepLeft} from "ramda"

import {getCollections, refCollection, refDocument} from ".."
import {ProgressEvent} from "./event"
import {Path} from "./path"

type DocumentSnapshot = FirebaseFirestore.DocumentSnapshot
type CollectionReference = FirebaseFirestore.CollectionReference

////////////////////////////////////////////////////////////////////////////////

export const backupProgress = new ProgressEvent()

export async function backupFirestore(sourcePath: string) {
  const path = new Path(sourcePath)
  let result = {}
  if (path.isEmpty) {
    const collections = await getCollections()
    for (const it of collections) {
      result = mergeDeepLeft(result, await _backupCollection(it))
    }
  } else if (path.isCollection) {
    const refColl = refCollection(path.reference)
    result = await _backupCollection(refColl)
  } else {
    const snapDoc = await refDocument(path.reference).get()
    if (snapDoc.exists) {
      backupProgress.emitSize(1)
      result = await _backupDocument(snapDoc)
    }
  }
  backupProgress.removeAllListeners()
  return result
}

////////////////////////////////////////////////////////////////////////////////

async function _backupCollection(ref: CollectionReference) {
  const snap = await ref.get()
  if (snap.empty) return {}
  backupProgress.emitSize(snap.size)
  let result = {}
  for (const snapDoc of snap.docs) {
    result = mergeDeepLeft(result, await _backupDocument(snapDoc))
  }
  return result
}

async function _backupDocument(snap: DocumentSnapshot) {
  if (!snap.exists) return {}
  const path = new Path(snap.ref.path)
  let result = assocPath(path.objectArray, snap.data()!)({})
  backupProgress.emitStep(snap.ref.path)
  const collections = await snap.ref.getCollections()
  for (const collection of collections) {
    result = mergeDeepLeft(result, await _backupCollection(collection))
  }
  return result
}
