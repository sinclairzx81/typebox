import { Type } from "../src/typebox"
import { ok, fail } from "./validate"

describe("Format", () => {
  it("should validate a date-time Format",  () => {
    const type = Type.Format('date-time')
    ok(type, "2018-11-13T20:20:39+00:00")
    fail(type, "2018-11-13")
    fail(type, "20:20:39+00:00")
    fail(type, "string")
  })
})
