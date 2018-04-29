import program from "commander"

import {backupFirestore, restoreFirestore} from "./firebase"

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
  const {output: outputPath, parent} = options
  const {config: configPath} = parent
  backupFirestore({configPath, outputPath, path})
}

function actionFirebaseRestore(...args: any[]) {
  const [path, options] = args
  const {json: jsonPath, parent} = options
  const {config: configPath} = parent
  restoreFirestore({configPath, jsonPath, path})
}
