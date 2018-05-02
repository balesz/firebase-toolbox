import {initializeApp, restoreFirestore} from "../.."
import {loadFromFile} from "../../../file"
import {fromJSON} from "../json"

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

const config = "../../GamerProFirebase/rn-gamerpro-staging.json"
const input = "./temp/backup.json"

describe("restoreFirestore()", () => {

  beforeAll(() => {
    initializeApp(config)
  })

  it("call with null data", async () => {
    expect.assertions(1)
    const path = "/test"
    const data: any = null
    try {await restoreFirestore(path, data)}
    catch (it) {expect(it.message).toBe("Data parameter is nil!!")}
  })

  it("call with invalid path", async () => {
    expect.assertions(1)
    const path = ""
    const data = {}
    try {await restoreFirestore(path, data)}
    catch (it) {expect(it.message).toBe("The path is not in the data!!")}
  })

  it("call with path which not in the data", async () => {
    expect.assertions(1)
    const path = "/uid"
    const data = {"__collection__": {uid: {hello: "hello", world: "world"}}}
    try {await restoreFirestore(path, data)}
    catch (it) {expect(it.message).toBe("The path is not in the data!!")}
  })

  it("call with proper params", async () => {
    expect.assertions(1)
    const path = "/collection/uid"
    const data = {"__collection__": {uid: {hello: "hello", world: "world"}}}
    const result = await restoreFirestore(path, data)
    expect(result.length).toBeGreaterThan(0)
  })

  it("call on a valid backup file", async () => {
    expect.assertions(1)
    const path = "/profile"
    const json = loadFromFile({input})
    const data = fromJSON(json)
    const result = await restoreFirestore(path, data)
    expect(result.length).toBeGreaterThan(0)
  })

})
