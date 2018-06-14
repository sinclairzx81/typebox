import { Static, Type } from "../src/typebox"
import { expect }       from "chai"
import { ok, fail }     from "./validate"

const a_number          = () => 1
const a_string          = () => "string"
const a_boolean         = () => true
const a_object          = () => ({})
const a_array           = () => []

describe("Union", () => {
  it("should validate a union (number)", () => {
    const _union = Type.Number()
    ok(_union, a_number())
    fail(_union, a_boolean())
    fail(_union, a_string())
  })
  it("should validate a union (number, boolean)", () => {
    const type_0 = Type.Number()
    const type_1 = Type.Boolean()
    const _union = Type.Union(type_0, type_1)
    ok(_union, a_number())
    ok(_union, a_boolean())
    fail(_union, a_string())
  })
  it("should validate a union (object, object)", () => {
    const type_0  = Type.Object({
      a: Type.String(),
      b: Type.Number(),
      c: Type.Boolean(),
    })
    const type_1  = Type.Object({
      c: Type.String(), // mixed string | boolean
      d: Type.Number(),
      e: Type.Boolean(),
    })
    const _union   = Type.Union(type_0, type_1)
    ok(_union, {
      a: a_string(),
      b: a_number(),
      c: a_boolean(),
    })
    ok(_union, {
      c: a_string(),
      d: a_number(),
      e: a_boolean(),
    })
    fail(_union, {
      c: a_boolean(),
      d: a_number(),
      e: a_boolean(),
    })
  })
  it("should validate a union (number, object)", () => {
    const type_0  = Type.Number()
    const type_1  = Type.Object({
      c: Type.String(),
      d: Type.Number(),
      e: Type.Boolean(),
    })
    const _union = Type.Union(type_0, type_1)
    fail(_union, a_string())
    ok(_union, a_number())
    ok(_union, {
      c: a_string(),
      d: a_number(),
      e: a_boolean(),
    })
  })
})


