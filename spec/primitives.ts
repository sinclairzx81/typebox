import { Type } from "../src/typebox"
import { ok, fail } from "./validate"

const a_null            = () => null
const a_number          = () => 1
const a_string          = () => "s"
const a_boolean         = () => true
const a_object          = () => ({})
const a_array           = () => []

describe("Primitives", () => {
  it("should validate null",  () => {
    ok(Type.Null(),   a_null())
    fail(Type.Null(), a_number())
    fail(Type.Null(), a_string())
    fail(Type.Null(), a_boolean())
    fail(Type.Null(), a_object())
    fail(Type.Null(), a_array())
  })
  it("should validate any",  () => {
    ok(Type.Any(), a_null())
    ok(Type.Any(), a_number())
    ok(Type.Any(), a_string())
    ok(Type.Any(), a_boolean())
    ok(Type.Any(), a_object())
    ok(Type.Any(), a_array())
  })
  it("should validate number",  () => {
    fail(Type.Number(),   a_null())
    ok(Type.Number(), a_number())
    fail(Type.Number(), a_string())
    fail(Type.Number(), a_boolean())
    fail(Type.Number(), a_object())
    fail(Type.Number(), a_array())
  })
  it("should validate string",  () => {
    fail(Type.String(),   a_null())
    fail(Type.String(), a_number())
    ok(Type.String(), a_string())
    fail(Type.String(), a_boolean())
    fail(Type.String(), a_object())
    fail(Type.String(), a_array())
  })
  it("should validate boolean",  () => {
    fail(Type.Boolean(), a_null())
    fail(Type.Boolean(), a_number())
    fail(Type.Boolean(), a_string())
    ok(Type.Boolean(), a_boolean())
    fail(Type.Boolean(), a_object())
    fail(Type.Boolean(), a_array())
  })
  it("should validate object",  () => {
    fail(Type.Object(),   a_null())
    fail(Type.Object({}), a_number())
    fail(Type.Object({}), a_string())
    fail(Type.Object({}), a_boolean())
    ok(Type.Object({}), a_object())
    fail(Type.Object({}), a_array())
  })
  it("should validate array",  () => {
    fail(Type.Array(), a_null())
    fail(Type.Array(), a_number())
    fail(Type.Array(), a_string())
    fail(Type.Array(), a_boolean())
    fail(Type.Array(), a_object())
    ok(Type.Array(), a_array())
  })
})
