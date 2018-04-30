import {unlinkSync} from "fs"

import {loadFromFile, saveToFile} from "../file"

describe("File Tests", () => {

  const obj = {hello: "Hello", world: "World"}
  const filePath = "./hello.json"

  afterAll(() => {
    unlinkSync(filePath)
  })

  it("try to save a null object to JSON", () => {
    expect(() => saveToFile({output: filePath, data: null as any}))
      .toThrowError("Data is null!!")
  })

  it("try to save object to JSON", () => {
    saveToFile({output: filePath, data: JSON.stringify(obj)})
    expect(true).toBeTruthy()
  })

  it("try to load object from a non existing file", () => {
    expect(() => loadFromFile({input: "./sadf.json"}))
      .toThrowError("Input file not exists!!")
  })

  it("try to load object from an existing file", () => {
    const obj = JSON.parse(loadFromFile({input: filePath}))
    expect(obj).not.toBeNull()
    expect(obj).toHaveProperty("hello")
  })

})
