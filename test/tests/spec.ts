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


import * as typebox from "../../src/index"
import * as assert from "assert"

const complex = typebox.Complex({
  a: typebox.Any(),
  b: typebox.Null(),
  c: typebox.Undefined(),
  d: typebox.Complex({}),
  e: typebox.Array(typebox.Any()),
  f: typebox.Tuple(typebox.Any()),
  g: typebox.Number(),
  h: typebox.String(),
  i: typebox.Boolean(),
  k: typebox.Union(typebox.Any()),
  l: typebox.Literal(10),
})

describe("spec", () => {
  it("Any should conform to specification.", () => {
    assert.deepEqual(typebox.Any(), {
      kind: "any"
    })
  })
  it("Null should conform to specification.", () => {
    assert.deepEqual(typebox.Null(), {
      kind: "null"
    })
  })
  it("Undefined should conform to specification.", () => {
    assert.deepEqual(typebox.Undefined(), {
      kind: "undefined"
    })
  })
  it("Object should conform to specification.", () => {
    assert.deepEqual(complex, {
      "kind": "complex",
      "properties": {
        "a": { "kind": "any" },
        "b": { "kind": "null" },
        "c": { "kind": "undefined" },
        "d": { "kind": "complex", "properties": {} },
        "e": { "kind": "array", "type": { "kind": "any" } },
        "f": { "kind": "tuple", "types": [{ "kind": "any" }] },
        "g": { "kind": "number" },
        "h": { "kind": "string" },
        "i": { "kind": "boolean" },
        "k": { "kind": "union", "types": [{ "kind": "any" }] },
        "l": { "kind": "literal", "value": 10 }
      }
    })
  })
  it("Array should conform to specification.", () => {
    assert.deepEqual(typebox.Array(typebox.Any()), {
      kind: "array",
      type: { kind: "any" }
    })
  })
  it("Array should default to type 'any' with zero arguments", () => {
    assert.deepEqual(typebox.Array(typebox.Any()), {
      kind: "array",
      type: { kind: "any" }
    })
  })
  it("Tuple should conform to specification.", () => {
    assert.deepEqual(typebox.Tuple(typebox.Any()), {
      kind: "tuple",
      types: [{ kind: "any" }]
    })
  })
  it("Tuple should throw on no arguments.", () => {
    let test = typebox.Tuple as any
    assert.throws(() => test())
  })
  it("Number should conform to specification.", () => {
    assert.deepEqual(typebox.Number(), {
      kind: "number"
    })
  })
  it("String should conform to specification.", () => {
    assert.deepEqual(typebox.String(), {
      kind: "string"
    })
  })
  it("Boolean should conform to specification.", () => {
    assert.deepEqual(typebox.Boolean(), {
      kind: "boolean"
    })
  })
  it("Literal should conform to specification.", () => {
    assert.deepEqual(typebox.Literal(1), {
      kind: "literal",
      value: 1
    })
  })
  it("Literal should throw on non string or numeric values.", () => {
    let test = typebox.Literal as any
    assert.throws(() => test({}))
    assert.throws(() => test(true))
    assert.throws(() => test(new Date()))
    assert.throws(() => test([]))
  })
  it("Union should conform to specification.", () => {
    assert.deepEqual(typebox.Union(typebox.Any()), {
      kind: "union",
      types: [{ kind: "any" }]
    })
  })
  it("Union should throw on no arguments.", () => {
    let test = typebox.Union as any
    assert.throws(() => test())
  })
})

export { /** */ }

