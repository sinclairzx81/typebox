import { Type } from "../src/typebox"
import { ok, fail } from "./validate"

describe("Literal", () => {
  it("should validate a string literal", () => {
    const type = Type.Literal("yes")
    ok(type, "yes")
    fail(type, "no")
  })
  it("should validate a number literal", () => {
    const type = Type.Literal(1)
    ok(type, 1)
    fail(type, 2)
  })
  it("should validate a boolean literal", () => {
    const type = Type.Literal(false)
    ok(type, false)
    fail(type, true)
  })
  it("should throw on non literal type (object)", () => {
    try {
      Type.Literal({} as any as string)
      throw Error("expected throw")
    } catch (e) { /* */ }
  })
  it("should throw on non literal type (array)", () => {
    try {
      Type.Literal([] as any as string)
      throw Error("expected throw")
    } catch (e) {/* */ }
  })
})
