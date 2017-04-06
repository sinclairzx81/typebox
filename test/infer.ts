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
import * as assert  from "assert"

describe("infer", () => {
  describe("Object", () => {
    it("should infer a object #1", () => {
      let type = typebox.infer({})
      assert.equal(type.type, "object")
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
      assert.equal(type.type, "object")
      let t = type as typebox.TObject
      assert.equal(t.properties['a'].type, "string")
      assert.equal(t.properties['b'].type, "number")
      assert.equal(t.properties['c'].type, "boolean")
      assert.equal(t.properties['d'].type, "array")
      assert.equal(t.properties['e'].type, "undefined")
      assert.equal(t.properties['f'].type, "null")
      assert.equal(t.properties['g'].type, "object")
    })
  })

  describe("Array", () => {
    it("an empty array should infer Array<Any>", () => {
      let type = typebox.infer([])
      assert.equal(type.type, "array")
      let t = type as typebox.TArray
      assert.equal(t.items.type, "any")
    })

    it("string elements should infer Array<String>", () => {
      let type = typebox.infer(["hello"])
      assert.equal(type.type, "array")
      let t = type as typebox.TArray
      assert.equal(t.items.type, "string")
    })

    it("numeric elements should infer Array<Number>", () => {
      let type = typebox.infer([1])
      assert.equal(type.type, "array")
      let t = type as typebox.TArray
      assert.equal(t.items.type, "number")
    })

    it("a mixed array should infer a union Array<String | Number>", () => {
      let type = typebox.infer([1, "hello"])
      assert.equal(type.type, "array")
      let t = type as typebox.TArray
      assert.equal(t.items.type, "union")
      let u = t.items as typebox.TUnion
      assert.equal(u.items[0].type, "number")
      assert.equal(u.items[1].type, "string")
    })
  })

  describe("String", () => {
    it("should infer a string", () => {
      let type = typebox.infer("hello world")
      assert.equal(type.type, "string")
    })
  })

  describe("Number", () => {
    it("should infer a number #1", () => {
      let type = typebox.infer(1)
      assert.equal(type.type, "number")
    })
    it("should infer a number #2", () => {
      let type = typebox.infer(NaN)
      assert.equal(type.type, "number")
    })
  })

  describe("Boolean", () => {
    it("should infer a boolean #1", () => {
      let type = typebox.infer(true)
      assert.equal(type.type, "boolean")
    })
    it("should infer a boolean #2", () => {
      let type = typebox.infer(false)
      assert.equal(type.type, "boolean")
    })
  })

  describe("Date", () => {
    it("should infer a date", () => {
      let type = typebox.infer(new Date())
      assert.equal(type.type, "date")
    })
  })

  describe("Function", () => {
    it("should infer a function #1", () => {
      let type = typebox.infer(function() {})
      assert.equal(type.type, "function")
    })
    it("should infer a function #2", () => {
      let type = typebox.infer(() => {})
      assert.equal(type.type, "function")
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
      let value = new Date()
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