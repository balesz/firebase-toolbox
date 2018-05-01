import {writeFileSync} from "fs"
import {lensPath, view} from "ramda"

import {backupFirestore, initializeApp} from "../.."
import {fromJSON, toJSON} from "../json"


jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000


describe("backupFirestore()", () => {

  const config = "../../GamerProFirebase/rn-gamerpro-staging.json"
  const output = "./temp/backup.json"

  beforeAll(() => {
    initializeApp(config)
  })

  it("try to backup test collection", async () => {
    expect.assertions(1)
    const result = await backupFirestore({path: "/test"})
    const lens = lensPath(["[test]", "testId", "timestamp"])
    console.warn(result)
    console.warn(toJSON(result))
    console.warn(fromJSON(toJSON(result)))
    console.warn(JSON.stringify(fromJSON(toJSON(result))))
    expect(view(lens)(result)).not.toBeUndefined()
  })

  it("try to backup a simple document", async () => {
    expect.assertions(1)
    const result = await backupFirestore({path: "/admin/users"})
    const lens = lensPath(["[admin]", "users"])
    expect(view(lens)(result)).not.toBeUndefined()
  })

  it("try to backup a simple collection", async () => {
    expect.assertions(1)
    const result = await backupFirestore({path: "/admin"})
    const lens = lensPath(["[admin]", "users"])
    expect(view(lens)(result)).not.toBeUndefined()
  })

  it("try to backup an advanced collection", async () => {
    expect.assertions(1)
    const result = await backupFirestore({path: "/profile"})
    const lens = lensPath(["[profile]", "5Xfwqv0HWYVXQHQTGpOq3GDXb573"])
    expect(view(lens)(result)).not.toBeUndefined()
  })

  it("try to backup the entire firestore", async () => {
    expect.assertions(1)
    const result = await backupFirestore({path: "/"})
    const lens = lensPath(["[profile]", "5Xfwqv0HWYVXQHQTGpOq3GDXb573"])
    expect(view(lens)(result)).not.toBeUndefined()
    writeFileSync(output, toJSON(result), "utf8")
  })

})
