import admin from "firebase-admin"
import fs from "fs"

import {lazy} from "../utils"

export function initializeApp(configPath: string) {
  if (!configPath) {
    throw Error("Missing config file path!")
  }

  if (!fs.existsSync(configPath)) {
    throw Error("Config file is not exists!")
  }

  var contents = fs.readFileSync(configPath, "utf8")
  var config = JSON.parse(contents)

  if (!config.project_id && !config.private_key_id && !config.private_key) {
    throw Error("Config file is invalid!")
  }

  return admin.initializeApp({
    projectId: config.project_id,
    credential: admin.credential.cert(configPath),
    databaseURL: `https://${config.project_id}.firebaseio.com`,
    storageBucket: `${config.project_id}.appspot.com`,
  })
}

export const database = lazy(() => admin.database())
export const firestore = lazy(() => admin.firestore())

export const getCollections = () => firestore().getCollections()
export const refDocument = (path: string) => firestore().doc(path)
export const refCollection = (path: string) => firestore().collection(path)
