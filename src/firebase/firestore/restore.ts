import {admin, initializeApp} from ".."

interface RestoreFirestoreParams {
  configPath: string
  jsonPath: string
  path: string
}

export async function restoreFirestore(params: RestoreFirestoreParams) {
  initializeApp(params.configPath)
  const collections = await admin.firestore().getCollections()
  console.warn(collections.map(it => it.id))
}
