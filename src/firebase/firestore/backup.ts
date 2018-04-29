import {admin, initializeApp} from ".."

interface BackupFirestoreParams {
  config: string
  path: string
}

export async function backupFirestore(params: BackupFirestoreParams) {
  const {config, path} = params
  initializeApp(config)
  let result: object = {}
  if (!path || path == "/") {
    const collections = await admin.firestore().getCollections()
    for (const it of collections) {
      result = {...result, ...await backupCoollection(it.path)}
    }
  } else {
    const doc = await admin.firestore().doc(path).get()
    if (doc.exists) result = await backupDocument(path)
    else result = await backupCoollection(path)
  }
  return result
}

async function backupDocument(path: string) {
  return {}
}

async function backupCoollection(path: string) {
  return {}
}
