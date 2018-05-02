import {existsSync, unlinkSync} from "fs"

import {loadFromFile, saveToFile} from "../file"

describe("File Tests", () => {

  const obj = {hello: "Hello", world: "World"}
  const filePath = "./hello.json"

  afterAll(() => {
    unlinkSync(filePath)
  })

  it("try to save a null object to JSON", () => {
    expect(() => saveToFile(filePath, ""))
      .toThrowError("Data is invalid!!")
  })

  it("try to save object to JSON", () => {
    saveToFile(filePath, JSON.stringify(obj))
    expect(existsSync(filePath)).toBe(true)
  })

  it("try to load object from a non existing file", () => {
    expect(() => loadFromFile("./asdf.json"))
      .toThrowError("Input file not exists!!")
  })

  it("try to load object from an existing file", () => {
    const obj = JSON.parse(loadFromFile(filePath))
    expect(obj).not.toBeNull()
    expect(obj).toHaveProperty("hello")
  })

})
