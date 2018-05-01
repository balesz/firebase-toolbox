import {assocPath, mergeDeepLeft} from "ramda"

import {admin} from ".."
import {getPathSegments, isCollectionPath} from "./path"

type DocumentSnapshot = FirebaseFirestore.DocumentSnapshot
type CollectionReference = FirebaseFirestore.CollectionReference

interface BackupFirestore {
  path: string
}

export async function backupFirestore(params: BackupFirestore) {
  const {path} = params
  let result = {}
  if (!path || path == "" || path == "/") {
    const collections = await admin.firestore().getCollections()
    for (const it of collections) {
      result = mergeDeepLeft(result, await _backupCollection(it))
    }
  } else {
    if (isCollectionPath(path)) {
      const refColl = admin.firestore().collection(path)
      result = await _backupCollection(refColl)
    } else {
      const snapDoc = await admin.firestore().doc(path).get()
      if (snapDoc.exists) result = await _backupDocument(snapDoc)
    }
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
  const segments = getPathSegments(snap.ref.path)
  result = mergeDeepLeft(result, assocPath(segments, snap.data()!)({}))
  return result
}
