import { Type } from "../src/typebox"
import { ok, fail }     from "./validate"

const a_any      = () => [1, true, "hello", {}, []]
const a_null     = () => [null, null]
const a_number   = () => [1, 2, 3]
const a_string   = () => ["a", "b", "c"]
const a_boolean  = () => [true, false, true]
const a_object   = () => [{}, {}, {}]
const a_array    = () => [[], [], []]

describe("Array", () => {
  it("should validate null",  () => {
    ok(Type.Array(Type.Null()),   a_null())
    fail(Type.Array(Type.Null()), a_number())
    fail(Type.Array(Type.Null()), a_string())
    fail(Type.Array(Type.Null()), a_boolean())
    fail(Type.Array(Type.Null()), a_object())
    fail(Type.Array(Type.Null()), a_array())
  })
  it("should validate any",  () => {
    ok(Type.Array(Type.Any()), a_any())
    ok(Type.Array(Type.Any()), a_null())
    ok(Type.Array(Type.Any()), a_number())
    ok(Type.Array(Type.Any()), a_string())
    ok(Type.Array(Type.Any()), a_boolean())
    ok(Type.Array(Type.Any()), a_object())
    ok(Type.Array(Type.Any()), a_array())
  })
  it("should validate number",  () => {
    fail(Type.Array(Type.Number()),   a_null())
    ok(Type.Array(Type.Number()), a_number())
    fail(Type.Array(Type.Number()), a_string())
    fail(Type.Array(Type.Number()), a_boolean())
    fail(Type.Array(Type.Number()), a_object())
    fail(Type.Array(Type.Number()), a_array())
  })
  it("should validate string",  () => {
    fail(Type.Array(Type.String()),   a_null())
    fail(Type.Array(Type.String()), a_number())
    ok(Type.Array(Type.String()), a_string())
    fail(Type.Array(Type.String()), a_boolean())
    fail(Type.Array(Type.String()), a_object())
    fail(Type.Array(Type.String()), a_array())
  })
  it("should validate boolean",  () => {
    fail(Type.Array(Type.Boolean()), a_null())
    fail(Type.Array(Type.Boolean()), a_number())
    fail(Type.Array(Type.Boolean()), a_string())
    ok(Type.Array(Type.Boolean()), a_boolean())
    fail(Type.Array(Type.Boolean()), a_object())
    fail(Type.Array(Type.Boolean()), a_array())
  })
  it("should validate object",  () => {
    fail(Type.Array(Type.Object()),   a_null())
    fail(Type.Array(Type.Object()), a_number())
    fail(Type.Array(Type.Object()), a_string())
    fail(Type.Array(Type.Object()), a_boolean())
    ok(Type.Array(Type.Object()), a_object())
    fail(Type.Array(Type.Object()), a_array())
  })
  it("should validate array",  () => {
    fail(Type.Array(Type.Array()), a_null())
    fail(Type.Array(Type.Array()), a_number())
    fail(Type.Array(Type.Array()), a_string())
    fail(Type.Array(Type.Array()), a_boolean())
    fail(Type.Array(Type.Array()), a_object())
    ok(Type.Array(Type.Array()), a_array())
  })
})
