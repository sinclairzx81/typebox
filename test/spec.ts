/*--------------------------------------------------------------------------

typebox - runtime structural type system for javascript.

The MIT License (MIT)

Copyright (c) 2017 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as typebox from "../src/index"
import * as assert from "assert"

const complex = typebox.Object({
  a: typebox.Any(),
  b: typebox.Null(),
  c: typebox.Undefined(),
  d: typebox.Object({}),
  e: typebox.Array(typebox.Any()),
  f: typebox.Tuple(typebox.Any()),
  g: typebox.Number(),
  h: typebox.String(),
  i: typebox.Boolean(),
  j: typebox.Function(),
  k: typebox.Union(typebox.Any()),
  l: typebox.Literal(10),
})

describe("spec", () => {
  it("Any should conform to specification.", () => {
    assert.deepEqual(typebox.Any(), {
      type: "any"
    })
  })
  it("Null should conform to specification.", () => {
    assert.deepEqual(typebox.Null(), {
      type: "null"
    })
  })
  it("Undefined should conform to specification.", () => {
    assert.deepEqual(typebox.Undefined(), {
      type: "undefined"
    })
  })
  it("Object should conform to specification.", () => {
    assert.deepEqual(complex, {
      "type": "object",
      "properties": {
        "a": { "type": "any" },
        "b": { "type": "null" },
        "c": { "type": "undefined" },
        "d": { "type": "object", "properties": {} },
        "e": { "type": "array", "items": { "type": "any" } },
        "f": { "type": "tuple", "items": [{ "type": "any" }] },
        "g": { "type": "number" },
        "h": { "type": "string" },
        "i": { "type": "boolean" },
        "j": { "type": "function" },
        "k": { "type": "union", "items": [{ "type": "any" }] },
        "l": { "type": "literal", "value": 10 }
      }
    })
  })
  it("Array should conform to specification.", () => {
    assert.deepEqual(typebox.Array(typebox.Any()), {
      type: "array",
      items: { type: "any" }
    })
  })
  it("Array should default to type 'any' with zero arguments", () => {
    assert.deepEqual(typebox.Array(), {
      type: "array",
      items: { type: "any" }
    })
  })
  it("Tuple should conform to specification.", () => {
    assert.deepEqual(typebox.Tuple(typebox.Any()), {
      type: "tuple",
      items: [{ type: "any" }]
    })
  })
  it("Number should conform to specification.", () => {
    assert.deepEqual(typebox.Number(), {
      type: "number"
    })
  })
  it("String should conform to specification.", () => {
    assert.deepEqual(typebox.String(), {
      type: "string"
    })
  })
  it("Boolean should conform to specification.", () => {
    assert.deepEqual(typebox.Boolean(), {
      type: "boolean"
    })
  })
  it("Date should conform to specification.", () => {
    assert.deepEqual(typebox.Date(), {
      type: "date"
    })
  })
  it("Literal should conform to specification.", () => {
    assert.deepEqual(typebox.Literal(1), {
      type: "literal",
      value: 1
    })
  })
  it("Literal should throw on non string | numeric types.", () => {
    assert.throws(() => typebox.Literal((<any>{})))
    assert.throws(() => typebox.Literal((<any>[])))
    assert.throws(() => typebox.Literal((<any>true)))
  })
})

export { /** */ }

