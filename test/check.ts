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

const hyper = typebox.Object({
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

const complex_instance = typebox.generate(complex)
const hyper_instance   = typebox.generate(hyper)

describe("check", () => {
  describe("Any", () => {
    it("should validate a null",      () => assert.equal(typebox.check(typebox.Any(), null).success,         true))
    it("should validate a undefined", () => assert.equal(typebox.check(typebox.Any(), undefined).success,    true))
    it("should validate a object",    () => assert.equal(typebox.check(typebox.Any(), {}).success,           true))
    it("should validate a array",     () => assert.equal(typebox.check(typebox.Any(), []).success,           true))
    it("should validate a number",    () => assert.equal(typebox.check(typebox.Any(), 1).success,            true))
    it("should validate a string",    () => assert.equal(typebox.check(typebox.Any(), "hello").success,      true))
    it("should validate a boolean",   () => assert.equal(typebox.check(typebox.Any(), true).success,         true))
    it("should validate a date",      () => assert.equal(typebox.check(typebox.Any(), new Date()).success,   true))
    it("should validate a function",  () => assert.equal(typebox.check(typebox.Any(), function(){}).success, true))
  })
  describe("Null", () => {
    it("should validate a null",      () => assert.equal(typebox.check(typebox.Null(), null).success,             true))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Null(), undefined).success,    false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Null(), {}).success,           false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Null(), []).success,           false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Null(), 1).success,            false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Null(), "hello").success,      false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Null(), true).success,         false))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.Null(), new Date()).success,   false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Null(), function(){}).success, false))
  })
  describe("Undefined", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Undefined(), null).success,         false))
    it("should validate a undefined",     () => assert.equal(typebox.check(typebox.Undefined(), undefined).success,    true))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Undefined(), {}).success,           false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Undefined(), []).success,           false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Undefined(), 1).success,            false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Undefined(), "hello").success,      false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Undefined(), true).success,         false))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.Undefined(), new Date()).success,   false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Undefined(), function(){}).success, false))
  })
  describe("Object", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Object(), null).success,         false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Object(), undefined).success,    false))
    it("should validate a object",        () => assert.equal(typebox.check(typebox.Object(), {}).success,           true))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Object(), []).success,           false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Object(), 1).success,            false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Object(), "hello").success,      false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Object(), true).success,         false))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.Object(), new Date()).success,   false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Object(), function(){}).success, false))
    it("should not validate for missing properties",  () => assert.equal(typebox.check(typebox.Object({name: typebox.String()}), {}).success, false))
    it("should not validate for extra properties",    () => assert.equal(typebox.check(typebox.Object({name: typebox.String()}), {name: "dave", age: 37}).success, false))
  })
  describe("Array", () => {
    it("should not validate a null",           () => assert.equal(typebox.check(typebox.Array(), null).success,         false))
    it("should not validate a undefined",      () => assert.equal(typebox.check(typebox.Array(), undefined).success,    false))
    it("should not validate a object",         () => assert.equal(typebox.check(typebox.Array(), {}).success,           false))
    it("should validate a array",              () => assert.equal(typebox.check(typebox.Array(), []).success,           true))
    it("should not validate a number",         () => assert.equal(typebox.check(typebox.Array(), 1).success,            false))
    it("should not validate a string",         () => assert.equal(typebox.check(typebox.Array(), "hello").success,      false))
    it("should not validate a boolean",        () => assert.equal(typebox.check(typebox.Array(), true).success,         false))
    it("should not validate a date",           () => assert.equal(typebox.check(typebox.Array(), new Date()).success,   false))
    it("should not validate a function",       () => assert.equal(typebox.check(typebox.Array(), function(){}).success, false))
    it("should validate a complex array",      () => assert.equal(typebox.check(typebox.Array(complex), [complex_instance]).success, true))
    it("should not validate a hyper array",    () => assert.equal(typebox.check(typebox.Array(complex), [hyper_instance]).success, false))
    it("should not validate a mixed array",    () => assert.equal(typebox.check(typebox.Array(complex), [complex_instance, complex_instance, complex_instance, 1]).success, false))
  })
  describe("Tuple:Empty", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Tuple(), null).success,         false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Tuple(), undefined).success,    false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Tuple(), {}).success,           false))
    it("should validate a array",         () => assert.equal(typebox.check(typebox.Tuple(), []).success,           true))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Tuple(), 1).success,            false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Tuple(), "hello").success,      false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Tuple(), true).success,         false))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.Tuple(), new Date()).success,   false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Tuple(), function(){}).success, false))
  })
  describe("Tuple:Elements", () => {
    it("should not validate a null",              () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), null).success,              false))
    it("should not validate a undefined",         () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), undefined).success,         false))
    it("should not validate a object",            () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), {}).success,                false))
    it("should not validate a array",             () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), []).success,                false))
    it("should not validate a number",            () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), 1).success,                 false))
    it("should not validate a string",            () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), "hello").success,           false))
    it("should not validate a boolean",           () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), true).success,              false))
    it("should not validate a date",              () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), new Date()).success,        false))
    it("should not validate a function",          () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), function(){}).success,      false))
    it("should not validate a [string, number]",  () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), ["hello", 1]).success,      false))
    it("should not validate a [complex, hyper]",  () => assert.equal(typebox.check(typebox.Tuple(hyper, complex), [complex_instance, hyper_instance]).success,    false))
    it("should not validate length mismatch",     () => assert.equal(typebox.check(typebox.Tuple(hyper, complex), [hyper_instance, complex_instance, 1]).success, false))
    it("should validate a [number, string]",      () => assert.equal(typebox.check(typebox.Tuple(typebox.Number(), typebox.String()), [1, "hello"]).success,      true))
    it("should validate a [hyper, complex]",      () => assert.equal(typebox.check(typebox.Tuple(hyper, complex), [hyper_instance, complex_instance]).success,    true))
  })
  describe("Number", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Number(), null).success,          false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Number(), undefined).success,     false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Number(), {}).success,            false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Number(), []).success,            false))
    it("should validate a number",        () => assert.equal(typebox.check(typebox.Number(), 1).success,              true))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Number(), "hello").success,       false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Number(), true).success,          false))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.Number(), new Date()).success,    false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Number(), function(){}).success,  false))
  })
  describe("String", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.String(), null).success,          false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.String(), undefined).success,     false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.String(), {}).success,            false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.String(), []).success,            false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.String(), 1).success,             false))
    it("should validate a string",        () => assert.equal(typebox.check(typebox.String(), "hello").success,       true))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.String(), true).success,          false))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.String(), new Date()).success,    false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.String(), function(){}).success,  false))
  })
  describe("Boolean", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Boolean(), null).success,          false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Boolean(), undefined).success,     false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Boolean(), {}).success,            false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Boolean(), []).success,            false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Boolean(), 1).success,             false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Boolean(), "hello").success,       false))
    it("should validate a boolean",       () => assert.equal(typebox.check(typebox.Boolean(), true).success,          true))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.Boolean(), new Date()).success,    false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Boolean(), function(){}).success,  false))
  })
  describe("Date", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Date(), null).success,          false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Date(), undefined).success,     false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Date(), {}).success,            false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Date(), []).success,            false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Date(), 1).success,             false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Date(), "hello").success,       false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Date(), true).success,          false))
    it("should validate a date",          () => assert.equal(typebox.check(typebox.Date(), new Date()).success,    true))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Date(), function(){}).success,  false))
  })
  describe("Function", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Function(), null).success,           false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Function(), undefined).success,      false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Function(), {}).success,             false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Function(), []).success,             false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Function(), 1).success,              false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Function(), "hello").success,        false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Function(), true).success,           false))
    it("should not validate a date",          () => assert.equal(typebox.check(typebox.Function(), new Date()).success, false))
    it("should validate a function",  () => assert.equal(typebox.check(typebox.Function(), function(){}).success,       true))
  })
  describe("Union:Empty", () => {
    it("should not validate a null",      () => assert.equal(typebox.check(typebox.Union(), null).success,          false))
    it("should not validate a undefined", () => assert.equal(typebox.check(typebox.Union(), undefined).success,     false))
    it("should not validate a object",    () => assert.equal(typebox.check(typebox.Union(), {}).success,            false))
    it("should not validate a array",     () => assert.equal(typebox.check(typebox.Union(), []).success,            false))
    it("should not validate a number",    () => assert.equal(typebox.check(typebox.Union(), 1).success,             false))
    it("should not validate a string",    () => assert.equal(typebox.check(typebox.Union(), "hello").success,       false))
    it("should not validate a boolean",   () => assert.equal(typebox.check(typebox.Union(), true).success,          false))
    it("should not validate a date",      () => assert.equal(typebox.check(typebox.Union(), new Date()).success,    false))
    it("should not validate a function",  () => assert.equal(typebox.check(typebox.Union(), function(){}).success,  false))
  })
  describe("Union(complex, hyper, number, string)", () => {
    it("should validate complex",           () => assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), complex_instance).success, true))
    it("should validate hyper",             () => assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), hyper_instance).success, true))
    it("should validate number",            () => assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), 1).success, true))
    it("should validate string",            () => assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), "hello").success, true))
    it("should not validate empty object",  () => assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), {}).success,    false))
    it("should not validate boolean",       () => assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), false).success, false))
    it("should not validate array",         () => assert.equal(typebox.check(typebox.Union(hyper, complex, typebox.Number(), typebox.String()), []).success,    false))
  })
  describe("Union(complex, any)", () => {
    it("should validate a null",      () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), null).success,           true))
    it("should validate a undefined", () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), undefined).success,      true))
    it("should validate a object",    () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), {}).success,             true))
    it("should validate a array",     () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), []).success,             true))
    it("should validate a number",    () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), 1).success,              true))
    it("should validate a string",    () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), "hello").success,        true))
    it("should validate a boolean",   () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), true).success,           true))
    it("should validate a date",      () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), new Date()).success, true))
    it("should validate a function",  () => assert.equal(typebox.check(typebox.Union(complex, typebox.Any()), function(){}).success,       true))
  })
})

export {/** */}