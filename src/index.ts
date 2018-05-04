import program from "commander"
import {Bar, Presets} from "cli-progress"

import {loadFromFile, saveToFile} from "./file"
import {initializeApp} from "./firebase"
import {backupFirestore, restoreFirestore, backupProgress, restoreProgress} from "./firebase/firestore"
import {fromJSON, toJSON} from "./firebase/firestore/json"
import {ProgressEvent} from "./utils"

program
  .version("0.1.0")
  .option("-C, --config <config>", "Config JSON path")

program
  .command("firestore:backup <path>")
  .description("Backup Firestore database from <path>")
  .option("-O, --output [output]", "Output directory", ".")
  .action(actionFirestoreBackup)

program
  .command("firestore:restore <path>")
  .description("Restore Firestore database to <path>")
  .option("-J, --json <json>", "Source JSON file")
  .action(actionFirestoreRestore)

program.parse(process.argv)

function actionFirestoreBackup(...args: any[]) {
  const [path, options] = args
  const {output, parent} = options
  const {config} = parent
  initializeApp(config)
  const progress = _setupProgress(backupProgress, "backup in progress")
  backupFirestore(path)
    .then(object => saveToFile(output, toJSON(object)))
    .then(() => progress.stop())
    .catch(() => progress.stop())
}

function actionFirestoreRestore(...args: any[]) {
  const [path, options] = args
  const {json: input, parent} = options
  const {config} = parent
  const data = fromJSON(loadFromFile(input))
  initializeApp(config)
  restoreFirestore(data, path)
}

function _setupProgress(event: ProgressEvent, title: string) {
  const progress = new Bar({
    format: `${title} [{bar}] {percentage}% | {value}/{total} | {duration_formatted}`
  }, Presets.shades_classic)
  progress.start(0, 0)
  event.onSize(size => progress.setTotal(size))
  event.onStep((message, count, size) => progress.update(count))
  return progress
}
