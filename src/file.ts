import {existsSync, readFileSync, writeFileSync} from "fs"

interface SaveToFile {
  data: string
  output: string
}

interface LoadFromFile {
  input: string
}

export function saveToFile(params: SaveToFile) {
  const {data, output} = params
  if (!data) throw Error("Data is null!!")
  writeFileSync(output, data, "utf8")
}

export function loadFromFile(params: LoadFromFile) {
  const {input} = params
  if (!existsSync(input)) throw Error("Input file not exists!!")
  const result = readFileSync(input, "utf8")
  return result
}
