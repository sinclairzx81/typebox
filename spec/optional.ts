import { Static, Type } from "../src/typebox"
import { ok, fail }     from "./validate"

const a_number          = () => 1
const a_string          = () => "s"
const a_boolean         = () => true
const a_object          = () => ({})
const a_array           = () => []
const a_undefined       = () => undefined
const a_null            = () => null

describe("Optional", () => {
  it("should not validate optional outside a object",  () => {
    const type = Type.Optional(Type.String())
    ok(type, a_string())
    fail(type, undefined)
  })
  it("should validate optional inside a Object",  () => {
    const type = Type.Object({ x: Type.Optional(Type.String()) })
    ok(type, {x: a_string() })
    ok(type, {x: a_undefined() })
    ok(type, a_object())
    fail(type, {x: a_null() })
  })
})
