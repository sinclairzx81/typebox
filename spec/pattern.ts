import { Type } from "../src/typebox"
import { ok, fail } from "./validate"

describe("Pattern", () => {
  it("should validate a pattern",  () => {
    const type = Type.Pattern(/[012345]/)
    ok(type, "0")
    ok(type, "1")
    ok(type, "2")
    ok(type, "3")
    ok(type, "4")
    ok(type, "5")
    fail(type, "6")
  })
})
