import {assocPath, mergeDeepLeft} from "ramda"

import {admin} from ".."
import {Path} from "./path"

type DocumentSnapshot = FirebaseFirestore.DocumentSnapshot
type CollectionReference = FirebaseFirestore.CollectionReference

export async function backupFirestore(sourcePath: string) {
  const path = new Path(sourcePath)
  let result = {}
  if (path.isEmpty) {
    const collections = await admin.firestore().getCollections()
    for (const it of collections) {
      result = mergeDeepLeft(result, await _backupCollection(it))
    }
  } else if (path.isCollection) {
    const refColl = admin.firestore().collection(path.reference)
    result = await _backupCollection(refColl)
  } else {
    const snapDoc = await admin.firestore().doc(path.reference).get()
    if (snapDoc.exists) result = await _backupDocument(snapDoc)
  }
  return result
}

async function _backupCollection(ref: CollectionReference) {
  const snap = await ref.get()
  if (snap.empty) return {}
  let result = {}
  for (const snapDoc of snap.docs) {
    result = mergeDeepLeft(result, await _backupDocument(snapDoc))
  }
  return result
}

async function _backupDocument(snap: DocumentSnapshot) {
  if (!snap.exists) return {}
  let result = {}
  const collections = await snap.ref.getCollections()
  for (const collection of collections) {
    result = mergeDeepLeft(result, await _backupCollection(collection))
  }
  const path = new Path(snap.ref.path)
  result = mergeDeepLeft(result, assocPath(path.objectArray, snap.data()!)({}))
  return result
}
