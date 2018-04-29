import {admin, initializeApp} from ".."

interface BackupFirestoreParams {
  configPath: string
  outputPath: string
  path: string
}

export async function backupFirestore(params: BackupFirestoreParams) {
  initializeApp(params.configPath)
  const collections = await admin.firestore().getCollections()
  console.warn(collections.map(it => it.id))
}
