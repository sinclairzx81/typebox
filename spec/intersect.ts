import { Type } from "../src/typebox"
import { ok, fail }     from "./validate"

describe("Intersect", () => {
  it("should intersect multiple objects", () => {
    const X = Type.Object({a: Type.Number(), b: Type.String()})
    const Y = Type.Object({c: Type.Boolean(),d: Type.Number()})
    const Z = Type.Intersect(X, Y)
    ok(Z, {a: 1, b: "s", c: true, d: 1 })
  })
  it("should intersect multiple objects (no collision overlap)", () => {
    const X = Type.Object({ a: Type.Number(), b: Type.String() })
    const Y = Type.Object({ c: Type.Boolean(), d: Type.Number() })
    const Z = Type.Intersect(X, Y, Type.Object({ a: Type.Number() }))
    ok(Z, { a: 1, b: "s", c: true, d: 1 })
  })
  it("should not intersect multiple objects (collision overlap)", () => {
    const X = Type.Object({ a: Type.Number(), b: Type.String() })
    const Y = Type.Object({ c: Type.Boolean(), d: Type.Number() })
    const Z = Type.Intersect(X, Y, Type.Object({ a: Type.String() }))
    fail(Z, { a: 1, b: "s", c: true, d: 1 })
  })
})
