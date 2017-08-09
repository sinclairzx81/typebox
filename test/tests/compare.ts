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
  j: typebox.Union(typebox.Any()),
  k: typebox.Literal(10),
})

const hyper_complex = typebox.Complex({
  a: typebox.Array(
    typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex)),
  ),
  b: typebox.Tuple(typebox.Null(), complex, complex, typebox.Null(), typebox.Array(
    typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex)),
  )),
  c: typebox.Union(typebox.Any(), typebox.Any(), typebox.Any(), typebox.Array(typebox.Any())),
  d: typebox.Array(complex),
  e: typebox.Array(typebox.Array(typebox.Array(typebox.Array(typebox.Array(complex))))),
})

describe("compare", () => {
  describe("Any", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Any(), typebox.Any()), true))
    it("should compare with Null", () => assert.equal(typebox.compare(typebox.Any(), typebox.Null()), true))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Any(), typebox.Undefined()), true))
    it("should compare with Object", () => assert.equal(typebox.compare(typebox.Any(), typebox.Complex()), true))
    it("should compare with Array", () => assert.equal(typebox.compare(typebox.Any(), typebox.Array()), true))
    it("should compare with Tuple", () => assert.equal(typebox.compare(typebox.Any(), typebox.Tuple(typebox.Any())), true))
    it("should compare with Number", () => assert.equal(typebox.compare(typebox.Any(), typebox.Number()), true))
    it("should compare with String", () => assert.equal(typebox.compare(typebox.Any(), typebox.String()), true))
    it("should compare with Boolean", () => assert.equal(typebox.compare(typebox.Any(), typebox.Boolean()), true))
    it("should compare with Union", () => assert.equal(typebox.compare(typebox.Any(), typebox.Union(typebox.String())), true))
  })
  describe("Null", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Null(), typebox.Any()), true))
    it("should compare with Null", () => assert.equal(typebox.compare(typebox.Null(), typebox.Null()), true))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Null(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Null(), typebox.Complex()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Null(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Null(), typebox.Tuple(typebox.Any())), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Null(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Null(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Null(), typebox.Boolean()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Null(), typebox.Union(typebox.String())), false))
  })
  describe("Undefined", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Undefined()), true))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Complex()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Tuple(typebox.Any())), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Boolean()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Union(typebox.String())), false))
  })
  describe("Object", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Null()), false))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Undefined()), false))
    it("should compare with Object", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Complex()), true))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Tuple(typebox.Any())), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Complex(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Boolean()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Complex(), typebox.Union(typebox.String())), false))
    it("should compare with Complex", () => assert.equal(typebox.compare(complex, complex), true)),
    it("should compare with Hyper Complex", () => assert.equal(typebox.compare(hyper_complex, hyper_complex), true))
  })
  describe("Array", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Array(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Array(), typebox.Null()), false))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Array(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Array(), typebox.Complex()), false))
    it("should compare with Array", () => assert.equal(typebox.compare(typebox.Array(), typebox.Array()), true))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Array(), typebox.Tuple(typebox.Any())), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Array(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Array(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Array(), typebox.Boolean()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Array(), typebox.Union(typebox.String())), false))
    it("should compare with Array<Complex>", () => assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(complex)), true))
    it("should not compare with Array<Complex> to Array<Number>", () => assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(typebox.Number())), false))
    it("should compare with Array<Complex> to Array<Any>", () => assert.equal(typebox.compare(typebox.Array(complex), typebox.Array()), true))
  })
  describe("Tuple", () => {
    it("should compare with Any",                           () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Any()), true))
    it("should not compare with Null",                      () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Null()), false))
    it("should not compare with Undefined",                 () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Undefined()), false))
    it("should not compare with Object",                    () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Complex()), false))
    it("should not compare with Array",                     () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Array()), false))
    it("should compare with Tuple",                         () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Tuple(typebox.Any())), true))
    it("should not compare with Number",                    () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Number()), false))
    it("should not compare with String",                    () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.String()), false))
    it("should not compare with Boolean",                   () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Boolean()), false))
    it("should not compare with Union",                     () => assert.equal(typebox.compare(typebox.Tuple(typebox.Any()), typebox.Union(typebox.String())), false))
    it("should not compare with tuple of different length", () => assert.equal(typebox.compare(typebox.Tuple(typebox.Number()), typebox.Tuple(typebox.Number(), typebox.Number())), false))
    it("should compare with tuple of same length",          () => assert.equal(typebox.compare(typebox.Tuple(typebox.Number(), typebox.Number()), typebox.Tuple(typebox.Number(), typebox.Number())), true))
    it("should compare with tuple of same length of Any",   () => assert.equal(typebox.compare(typebox.Tuple(typebox.Number(), typebox.Number()), typebox.Tuple(typebox.Any(), typebox.Any())), true))
  })
  describe("Number", () => {
    it("should compare with Any",         () => assert.equal(typebox.compare(typebox.Number(), typebox.Any()), true))
    it("should not compare with Null",    () => assert.equal(typebox.compare(typebox.Number(), typebox.Null()), false))
    it("should compare with Undefined",   () => assert.equal(typebox.compare(typebox.Number(), typebox.Undefined()), false))
    it("should not compare with Object",  () => assert.equal(typebox.compare(typebox.Number(), typebox.Complex()), false))
    it("should not compare with Array",   () => assert.equal(typebox.compare(typebox.Number(), typebox.Array()), false))
    it("should not compare with Tuple",   () => assert.equal(typebox.compare(typebox.Number(), typebox.Tuple(typebox.Any())), false))
    it("should compare with Number",      () => assert.equal(typebox.compare(typebox.Number(), typebox.Number()), true))
    it("should not compare with String",  () => assert.equal(typebox.compare(typebox.Number(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Number(), typebox.Boolean()), false))
    it("should not compare with Union",   () => assert.equal(typebox.compare(typebox.Number(), typebox.Union(typebox.String())), false))
  })
  describe("String", () => {
    it("should compare with Any",         () => assert.equal(typebox.compare(typebox.String(), typebox.Any()), true))
    it("should not compare with Null",    () => assert.equal(typebox.compare(typebox.String(), typebox.Null()), false))
    it("should compare with Undefined",   () => assert.equal(typebox.compare(typebox.String(), typebox.Undefined()), false))
    it("should not compare with Object",  () => assert.equal(typebox.compare(typebox.String(), typebox.Complex()), false))
    it("should not compare with Array",   () => assert.equal(typebox.compare(typebox.String(), typebox.Array()), false))
    it("should not compare with Tuple",   () => assert.equal(typebox.compare(typebox.String(), typebox.Tuple(typebox.Any())), false))
    it("should not compare with Number",  () => assert.equal(typebox.compare(typebox.String(), typebox.Number()), false))
    it("should compare with String",      () => assert.equal(typebox.compare(typebox.String(), typebox.String()), true))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.String(), typebox.Boolean()), false))
    it("should not compare with Union",   () => assert.equal(typebox.compare(typebox.String(), typebox.Union(typebox.Boolean())), false))
  })
  describe("Boolean", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Complex()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Tuple(typebox.Any())), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.String()), false))
    it("should compare with Boolean", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Boolean()), true))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Union(typebox.String())), false))
  })

  describe("Union", () => {
    it("should compare with Any",           () => assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Any()), true))
    it("should not compare with Null",      () => assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Null()), false))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Undefined()), false))
    it("should not compare with Object",    () => assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Complex()), false))
    it("should not compare with Array",     () => assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Array()), false))
    it("should not compare with Tuple",     () => assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Tuple(typebox.Any())), false))
    it("should not compare with Number",    () => assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Number()), false))
    it("should not compare with String",    () => assert.equal(typebox.compare(typebox.Union(typebox.Boolean()), typebox.String()), false))
    it("should not compare with Boolean",   () => assert.equal(typebox.compare(typebox.Union(typebox.String()), typebox.Boolean()), false))
    it("should compare with when both Unions are empty.", () => assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Union(typebox.Any())), true))
    it("should compare with compatible types #1", () => assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(complex)), true))
    it("should compare with compatible types #2", () => assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(typebox.Number(), complex)), true))
    it("should compare with compatible types #3", () => assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Union(typebox.Number(), complex)), true))
    it("should compare with compatible types #4", () => assert.equal(typebox.compare(typebox.Union(typebox.Array(complex)), typebox.Union(typebox.Array(typebox.Any()))), true))
  })
})


export {/** */ }
