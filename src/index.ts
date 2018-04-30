import program from "commander"

import {loadFromFile, saveToFile} from "./file"
import {backupFirestore, restoreFirestore} from "./firebase"
import {fromJSON, toJSON} from "./firebase/firestore/json"

program
  .version("0.1.0")
  .option("-C, --config <config>", "Config JSON path")

program
  .command("firestore:backup <path>")
  .description("Backup Firestore database from <path>")
  .option("-O, --output [output]", "Output directory", ".")
  .action(actionFirebaseBackup)

program
  .command("firestore:restore <path>")
  .description("Restore Firestore database to <path>")
  .option("-J, --json <json>", "Source JSON file")
  .action(actionFirebaseRestore)

program.parse(process.argv)

function actionFirebaseBackup(...args: any[]) {
  const [path, options] = args
  const {output, parent} = options
  const {config} = parent
  backupFirestore({config, path})
    .then(object => saveToFile({data: toJSON(object), output}))
}

function actionFirebaseRestore(...args: any[]) {
  const [path, options] = args
  const {json: input, parent} = options
  const {config} = parent
  const content = loadFromFile({input})
  const object = fromJSON(content)
  restoreFirestore({config, object, path})
}
