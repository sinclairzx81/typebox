import { Type } from "../src/typebox"
import { ok, fail } from "./validate"

describe("Enum", () => {
  it("should validate a string enum", () => {
    const type = Type.Enum("yes", "no")
    ok(type, "yes")
    ok(type, "no")
    fail(type, "maybe")
  })
  it("should validate a number enum", () => {
    const type = Type.Enum(1, 2)
    ok(type, 1)
    ok(type, 2)
    fail(type, 3)
  })
  it("should validate a boolean enum", () => {
    const type = Type.Enum(true, false)
    ok(type, true)
    ok(type, false)
  })
  it("should throw on non literal type", () => {
    try {
      Type.Enum({} as string)
      throw Error("expected throw")
    } catch (e) {}
  })
  it("should throw on non uniform literal type", () => {
    try {
      Type.Enum(1, "test", true)
      throw Error("expected throw")
    } catch (e) {}
  })
})
