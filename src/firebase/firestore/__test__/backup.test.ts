import {writeFileSync} from "fs"
import {lensPath, view} from "ramda"

import {backupFirestore} from "../.."
import {fromJSON, toJSON} from "../utils"

describe("backupFirestore()", () => {

  const config = "../../GamerProFirebase/rn-gamerpro-staging.json"

  it("try to backup a simple document", async () => {
    expect.assertions(1)
    const result = await backupFirestore({config, path: "/admin/users"})
    const lens = lensPath(["[admin]", "users"])
    expect(view(lens)(result)).not.toBeUndefined()
  }, 600000)

  it("try to backup a simple collection", async () => {
    expect.assertions(1)
    const result = await backupFirestore({config, path: "/admin"})
    const lens = lensPath(["[admin]", "users"])
    expect(view(lens)(result)).not.toBeUndefined()
  }, 600000)

  it("try to backup an advanced collection", async () => {
    expect.assertions(1)
    const result = await backupFirestore({config, path: "/profile"})
    const lens = lensPath(["[profile]", "5Xfwqv0HWYVXQHQTGpOq3GDXb573"])
    expect(view(lens)(result)).not.toBeUndefined()
  }, 600000)

  it("try to backup the entire firestore", async () => {
    expect.assertions(1)
    const result = await backupFirestore({config, path: "/"})
    const lens = lensPath(["[profile]", "5Xfwqv0HWYVXQHQTGpOq3GDXb573"])
    expect(view(lens)(result)).not.toBeUndefined()
    writeFileSync("backup.json", toJSON(result), "utf8")
  }, 600000)

  fit("try to backup test collection", async () => {
    expect.assertions(1)
    const result = await backupFirestore({config, path: "/test"})
    const lens = lensPath(["[test]", "testId", "timestamp"])
    console.warn(result)
    console.warn(toJSON(result))
    console.warn(fromJSON(toJSON(result)))
    console.warn(JSON.stringify(fromJSON(toJSON(result))))
    expect(view(lens)(result)).not.toBeUndefined()
  }, 600000)

})
