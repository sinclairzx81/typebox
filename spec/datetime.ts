import { Type } from "../src/typebox"
import { ok, fail } from "./validate"

describe("DateTime", () => {
  it("should validate a datetime",  () => {
    const type = Type.DateTime()
    ok(type, "2018-11-13T20:20:39+00:00")
    fail(type, "2018-11-13")
    fail(type, "20:20:39+00:00")
    fail(type, "string")
  })
})
