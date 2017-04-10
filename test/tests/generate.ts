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
import * as assert  from "assert"

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
  k: typebox.Union(typebox.Any()),
  l: typebox.Literal(10),
})

describe("generate", () => {
  it("Any should generate a empty object", () => {
    let type  = typebox.Any();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "object")
  })
  it("Null should generate a null", () => {
    let type  = typebox.Null();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "null")
  })
  it("Undefined should generate a undefined", () => {
    let type  = typebox.Undefined();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "undefined")
  })
  it("Object should generate a object", () => {
    let type  = typebox.Object();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "object")
  })
  it("Array should generate a array", () => {
    let type  = typebox.Array();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "array")
  })
  it("Tuple should generate a array", () => {
    let type  = typebox.Tuple(typebox.String());
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "array")
  }) 
  it("Number should generate a number", () => {
    let type  = typebox.Number();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "number")
  })
  it("String should generate a string", () => {
    let type  = typebox.String();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "string")
  })
  it("Boolean should generate a boolean", () => {
    let type  = typebox.Boolean();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "boolean")
  })
  it("Boolean should generate a boolean", () => {
    let type  = typebox.Boolean();
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "boolean")
  })
  it("Union should generate the first type", () => {
    let type  = typebox.Union(typebox.Number());
    let value = typebox.generate(type);
    assert.equal(typebox.reflect(value), "number")
  })
  it("Complex should generate a object that validates", () => {
    let value = typebox.generate(complex)
    let result = typebox.check(complex, value)
    assert.equal(result.success, true)
  })
})

export {/** */}