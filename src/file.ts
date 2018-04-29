import {writeFileSync, readFileSync} from "fs"

interface SaveObjectToJSONParams {
  object: object
  output: string
}

interface LoadObjectFromJSONParams {
  input: string
}

export function saveObjectToJSON(params: SaveObjectToJSONParams) {
  const {output, object} = params
  const json = JSON.stringify(object)
  writeFileSync(output, json, "utf8")
}

export function loadObjectFromJSON(params: LoadObjectFromJSONParams) {
  const {input} = params
  const content = readFileSync(input, "utf8")
  const result = JSON.parse(content)
  return result
}
