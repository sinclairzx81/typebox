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

import * as spec from "./spec"

/**
 * tests the left and right type for structural compatiable. If this function
 * returns true, it means that the left type is compatiable with the right.
 * @param {TAny} left the left type.
 * @param {TAny} right the right type.
 * @returns {boolean}
 */
export function compare(left: spec.TBase<any>, right: spec.TBase<any>): boolean {
  if(left.kind === "any"       || right.kind === "any")       return true
  if(left.kind === "string"    && right.kind === "string")    return true
  if(left.kind === "number"    && right.kind === "number")    return true
  if(left.kind === "null"      && right.kind === "null")      return true
  if(left.kind === "undefined" && right.kind === "undefined") return true
  if(left.kind === "boolean"   && right.kind === "boolean")   return true
  if(left.kind === "literal"   && right.kind === "literal")   return (<spec.TLiteral<spec.TLiteralType>>left).value === (<spec.TLiteral<spec.TLiteralType>>right).value
  
  // Object
  if(left.kind === "object" && right.kind === "object") {
    let object_left   = <spec.TObject<{[key in string]: spec.TBase<any>}>>left
    let object_right  = <spec.TObject<{[key in string]: spec.TBase<any>}>>right
    let keys          = Object.keys(object_left.properties)
    if(keys.length !== Object.keys(object_right.properties).length) {
      return false
    }
    for(let i = 0; i < keys.length; i++) {
      if(object_right.properties[keys[i]] === undefined) {
        return false
      }
    }
    for(let i = 0; i < keys.length; i++) {
      if(compare(object_left.properties[keys[i]], object_right.properties[keys[i]]) === false) { 
        return false
      }
    } return true
  }

  // Array
  if(left.kind === "array" && right.kind === "array") {
    let array_left   = <spec.TArray<spec.TBase<any>>>left
    let array_right  = <spec.TArray<spec.TBase<any>>>right
    return compare(array_left.type, array_right.type)
  }

  // Tuple
  if(left.kind === "tuple" && right.kind === "tuple") {
    let tuple_left   = <spec.TTuple1<spec.TBase<any>>>left
    let tuple_right  = <spec.TTuple1<spec.TBase<any>>>right
    if(tuple_left.types.length !== tuple_right.types.length) return false
    for(let i = 0; i < tuple_left.types.length; i++) {
      if(compare(tuple_left.types[i], tuple_right.types[i]) === false) {
        return false
      }
    } return true
  }

  // union:zero length for left and right.
  if(left.kind === "union" && right.kind === "union") {
    let union_left   = <spec.TUnion1<spec.TBase<any>>>left
    let union_right  = <spec.TUnion1<spec.TBase<any>>>right
    if(union_left.types.length === 0 && union_right.types.length === 0) {
      return true
    }
  }

  // union:left
  if(left.kind === "union") {
    let union_left   = <spec.TUnion1<spec.TBase<any>>>left
    for(let i = 0; i < union_left.types.length; i++) {
      if(compare(union_left.types[i], right) === true) {
        return true
      } 
    }
  }
  // union:right
  if(right.kind === "union") {
    let union_right  = <spec.TUnion1<spec.TBase<any>>>right
    for(let i = 0; i < union_right.types.length; i++) {
      if(compare(union_right.types[i], left) === true) {
        return true
      } 
    }
  } return false
}