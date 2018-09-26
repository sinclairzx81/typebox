import { Type } from "../src/typebox"
import { ok, fail }     from "./validate"

describe("Array", () => {
  it("should validate dictionary (string)",  () => {
    const dict = Type.Dictionary(Type.String())
    ok(dict, { a: "a", b: "b", c: "c" })
    fail(dict,  { a: 1, b: 2, c: 3 })
  })
  it("should validate dictionary (string | number)",  () => {
    const dict = Type.Dictionary(Type.Union(Type.String(), Type.Number()))
    ok(dict, { a: "a", b: "b", c: "c" })
    ok(dict,  { a: 1, b: 2, c: 3 })
    ok(dict,  { a: "a", b: 2, c: "c" })
    fail(dict, {a: false, b: false, c: false })
  })
  it("should validate dictionary (object | string)",  () => {
    const type = Type.Object({a: Type.Number(), b: Type.Number(), c: Type.Number() })
    const dict = Type.Dictionary (Type.Union(type, Type.String()))
    ok(dict, { a: {a: 1, b: 2, c: 3 }, b: "b", c: "c" })
    fail(dict, { a: {a: 1, b: 2, c: 3 }, b: 1, c: 2 })
  })
})
