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

describe("infer", () => {
  describe("Object", () => {
    it("should infer a object #1", () => {
      let type = typebox.infer({})
      assert.equal(type.kind, "object")
    })
    it("should infer a object #2", () => {
      let type = typebox.infer({
        a: "hello",
        b: 123,
        c: true,
        d: [],
        e: undefined,
        f: null,
        g: {}
      })
      assert.equal(type.kind, "object")
      let t = type as typebox.TObject<typebox.TObjectProperties>
      assert.equal(t.properties['a'].kind, "string")
      assert.equal(t.properties['b'].kind, "number")
      assert.equal(t.properties['c'].kind, "boolean")
      assert.equal(t.properties['d'].kind, "array")
      assert.equal(t.properties['e'].kind, "undefined")
      assert.equal(t.properties['f'].kind, "null")
      assert.equal(t.properties['g'].kind, "object")
    })
  })

  describe("Array", () => {
    it("an empty array should infer Array<Any>", () => {
      let type = typebox.infer([])
      assert.equal(type.kind, "array")
      let t = type as typebox.TArray<typebox.TBase<any>>
      assert.equal(t.type.kind, "any")
    })

    it("string elements should infer Array<String>", () => {
      let type = typebox.infer(["hello"])
      assert.equal(type.kind, "array")
      let t = type as typebox.TArray<typebox.TBase<any>>
      assert.equal(t.type.kind, "string")
    })

    it("numeric elements should infer Array<Number>", () => {
      let type = typebox.infer([1])
      assert.equal(type.kind, "array")
      let t = type as typebox.TArray<typebox.TBase<any>>
      assert.equal(t.type.kind, "number")
    })

    it("a mixed array should infer a union Array<String | Number>", () => {
      let type = typebox.infer([1, "hello"])
      assert.equal(type.kind, "array")
      let t = type as typebox.TArray<typebox.TBase<any>>
      assert.equal(t.type.kind, "union")
      let u = t.type as typebox.TUnion1<typebox.TBase<any>>
      assert.equal(u.types[0].kind, "number")
      assert.equal(u.types[1].kind, "string")
    })
  })

  describe("String", () => {
    it("should infer a string", () => {
      let type = typebox.infer("hello world")
      assert.equal(type.kind, "string")
    })
  })

  describe("Number", () => {
    it("should infer a number #1", () => {
      let type = typebox.infer(1)
      assert.equal(type.kind, "number")
    })
    it("should infer a number #2", () => {
      let type = typebox.infer(NaN)
      assert.equal(type.kind, "number")
    })
  })

  describe("Boolean", () => {
    it("should infer a boolean #1", () => {
      let type = typebox.infer(true)
      assert.equal(type.kind, "boolean")
    })
    it("should infer a boolean #2", () => {
      let type = typebox.infer(false)
      assert.equal(type.kind, "boolean")
    })
  })

  describe("Valid", () => {
    it("should validate against the original value #1", () => {
      let value = {
        a: "string",
        b: 1,
        c: true,
        d: false,
        e: [],
        f: [{a: 1}],
        g: null,
        h: undefined,
        i: {}
      }
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #2", () => {
      let value = 1
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #3", () => {
      let value = "hello"
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #4", () => {
      let value = [{
        a: "string",
        b: 1,
        c: true,
        d: false,
        e: [],
        f: [{a: 1}],
        g: null,
        h: undefined,
        i: {}
      }]
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #5", () => {
      let value = true
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #6", () => {
      let value = false
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #7", () => {
      let value = {}
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #8", () => {
      let value = []
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #9", () => {
      let value  = undefined
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #10", () => {
      let value = undefined
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #11", () => {
      let value = null
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
    it("should validate against the original value #12", () => {
      let value  = NaN
      let type   = typebox.infer(value)
      let result = typebox.check(type, value)
      assert.equal(result.success, true)
    })
  })
})

export {/** */}