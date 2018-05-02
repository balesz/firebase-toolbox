import {existsSync, readFileSync, writeFileSync} from "fs"


export function saveToFile(path: string, data: string) {
  if (!data) throw Error("Data is invalid!!")
  writeFileSync(path, data, "utf8")
}

export function loadFromFile(path: string) {
  if (!existsSync(path)) throw Error("Input file not exists!!")
  const result = readFileSync(path, "utf8")
  return result
}
