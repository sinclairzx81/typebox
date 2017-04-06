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
  d: typebox.Object(),
  e: typebox.Array(typebox.Any()),
  f: typebox.Tuple(typebox.Any()),
  g: typebox.Number(),
  h: typebox.String(),
  i: typebox.Boolean(),
  j: typebox.Function(),
  k: typebox.Union(typebox.Any()),
  l: typebox.Literal(10),
})

const hyper_complex = typebox.Object({
  a: typebox.Array(
    typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex)),
  ),
  b: typebox.Tuple(typebox.Null(), complex, complex, typebox.Null(), typebox.Array(
    typebox.Union(complex, typebox.Union(typebox.Number(), typebox.Boolean(), complex)),
  )),
  c: typebox.Union(typebox.Any(), typebox.Any(), typebox.Any(), typebox.Array()),
  d: typebox.Array(complex),
  e: typebox.Array(typebox.Array(typebox.Array(typebox.Array(typebox.Array(complex))))),
})

describe("compare", () => {
  describe("Any", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Any(), typebox.Any()), true))
    it("should compare with Null", () => assert.equal(typebox.compare(typebox.Any(), typebox.Null()), true))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Any(), typebox.Undefined()), true))
    it("should compare with Object", () => assert.equal(typebox.compare(typebox.Any(), typebox.Object()), true))
    it("should compare with Array", () => assert.equal(typebox.compare(typebox.Any(), typebox.Array()), true))
    it("should compare with Tuple", () => assert.equal(typebox.compare(typebox.Any(), typebox.Tuple()), true))
    it("should compare with Number", () => assert.equal(typebox.compare(typebox.Any(), typebox.Number()), true))
    it("should compare with String", () => assert.equal(typebox.compare(typebox.Any(), typebox.String()), true))
    it("should compare with Boolean", () => assert.equal(typebox.compare(typebox.Any(), typebox.Boolean()), true))
    it("should compare with Date", () => assert.equal(typebox.compare(typebox.Any(), typebox.Date()), true))
    it("should compare with Function", () => assert.equal(typebox.compare(typebox.Any(), typebox.Function()), true))
    it("should compare with Union", () => assert.equal(typebox.compare(typebox.Any(), typebox.Union()), true))
  })
  describe("Null", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Null(), typebox.Any()), true))
    it("should compare with Null", () => assert.equal(typebox.compare(typebox.Null(), typebox.Null()), true))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Null(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Null(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Null(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Null(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Null(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Null(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Null(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Null(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Null(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Null(), typebox.Union()), false))
  })
  describe("Undefined", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Undefined()), true))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Undefined(), typebox.Union()), false))
  })
  describe("Object", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Object(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Object(), typebox.Null()), false))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Object(), typebox.Undefined()), false))
    it("should compare with Object", () => assert.equal(typebox.compare(typebox.Object(), typebox.Object()), true))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Object(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Object(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Object(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Object(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Object(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Object(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Object(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Object(), typebox.Union()), false))
    it("should compare with Complex", () => assert.equal(typebox.compare(complex, complex), true)),
      it("should compare with Hyper Complex", () => assert.equal(typebox.compare(hyper_complex, hyper_complex), true))
  })
  describe("Array", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Array(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Array(), typebox.Null()), false))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Array(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Array(), typebox.Object()), false))
    it("should compare with Array", () => assert.equal(typebox.compare(typebox.Array(), typebox.Array()), true))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Array(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Array(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Array(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Array(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Array(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Array(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Array(), typebox.Union()), false))
    it("should compare with Array<Complex>", () => assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(complex)), true))
    it("should not compare with Array<Complex> to Array<Number>", () => assert.equal(typebox.compare(typebox.Array(complex), typebox.Array(typebox.Number())), false))
    it("should compare with Array<Complex> to Array<Any>", () => assert.equal(typebox.compare(typebox.Array(complex), typebox.Array()), true))
  })
  describe("Tuple", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Null()), false))
    it("should not compare with Undefined", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Array()), false))
    it("should compare with Tuple", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Tuple()), true))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Tuple(), typebox.Union()), false))
    it("should not compare with tuple of different length", () => assert.equal(typebox.compare(typebox.Tuple(typebox.Number()), typebox.Tuple(typebox.Number(), typebox.Number())), false))
    it("should compare with tuple of same length", () => assert.equal(typebox.compare(typebox.Tuple(typebox.Number(), typebox.Number()), typebox.Tuple(typebox.Number(), typebox.Number())), true))
    it("should compare with tuple of same length of Any", () => assert.equal(typebox.compare(typebox.Tuple(typebox.Number(), typebox.Number()), typebox.Tuple(typebox.Any(), typebox.Any())), true))
  })
  describe("Number", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Number(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Number(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Number(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Number(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Number(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Number(), typebox.Tuple()), false))
    it("should compare with Number", () => assert.equal(typebox.compare(typebox.Number(), typebox.Number()), true))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Number(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Number(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Number(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Number(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Number(), typebox.Union()), false))
  })
  describe("String", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.String(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.String(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.String(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.String(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.String(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.String(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.String(), typebox.Number()), false))
    it("should compare with String", () => assert.equal(typebox.compare(typebox.String(), typebox.String()), true))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.String(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.String(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.String(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.String(), typebox.Union()), false))
  })
  describe("Boolean", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.String()), false))
    it("should compare with Boolean", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Boolean()), true))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Boolean(), typebox.Union()), false))
  })
  describe("Date", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Date(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Date(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Date(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Date(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Date(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Date(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Date(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Date(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Date(), typebox.Boolean()), false))
    it("should compare with Date", () => assert.equal(typebox.compare(typebox.Date(), typebox.Date()), true))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Date(), typebox.Function()), false))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Date(), typebox.Union()), false))
  })
  describe("Function", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Function(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Function(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Function(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Function(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Function(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Function(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Function(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Function(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Function(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Function(), typebox.Date()), false))
    it("should compare with Function", () => assert.equal(typebox.compare(typebox.Function(), typebox.Function()), true))
    it("should not compare with Union", () => assert.equal(typebox.compare(typebox.Function(), typebox.Union()), false))
  })

  describe("Union", () => {
    it("should compare with Any", () => assert.equal(typebox.compare(typebox.Union(), typebox.Any()), true))
    it("should not compare with Null", () => assert.equal(typebox.compare(typebox.Union(), typebox.Null()), false))
    it("should compare with Undefined", () => assert.equal(typebox.compare(typebox.Union(), typebox.Undefined()), false))
    it("should not compare with Object", () => assert.equal(typebox.compare(typebox.Union(), typebox.Object()), false))
    it("should not compare with Array", () => assert.equal(typebox.compare(typebox.Union(), typebox.Array()), false))
    it("should not compare with Tuple", () => assert.equal(typebox.compare(typebox.Union(), typebox.Tuple()), false))
    it("should not compare with Number", () => assert.equal(typebox.compare(typebox.Union(), typebox.Number()), false))
    it("should not compare with String", () => assert.equal(typebox.compare(typebox.Union(), typebox.String()), false))
    it("should not compare with Boolean", () => assert.equal(typebox.compare(typebox.Union(), typebox.Boolean()), false))
    it("should not compare with Date", () => assert.equal(typebox.compare(typebox.Union(), typebox.Date()), false))
    it("should not compare with Function", () => assert.equal(typebox.compare(typebox.Union(), typebox.Function()), false))
    it("should compare with when both Unions are empty.", () => assert.equal(typebox.compare(typebox.Union(), typebox.Union()), true))
    it("should not compare with incompatible types #1", () => assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.String())), false))
    it("should not compare with incompatible types #2", () => assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.Object())), false))
    it("should not compare with incompatible types #3", () => assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.Union())), false))
    it("should not compare with incompatible types #4", () => assert.equal(typebox.compare(typebox.Union(typebox.Number()), typebox.Union(typebox.Array())), false))
    it("should compare with compatible types #1", () => assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(complex)), true))
    it("should compare with compatible types #2", () => assert.equal(typebox.compare(typebox.Union(complex), typebox.Union(typebox.Number(), complex)), true))
    it("should compare with compatible types #3", () => assert.equal(typebox.compare(typebox.Union(typebox.Any()), typebox.Union(typebox.Number(), complex)), true))
    it("should compare with compatible types #4", () => assert.equal(typebox.compare(typebox.Union(typebox.Array(complex)), typebox.Union(typebox.Array(typebox.Any()))), true))
  })
})


export {/** */ }
