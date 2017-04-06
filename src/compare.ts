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

import {
    TAny,
    TNull,
    TUndefined,
    TObject, 
    TArray,
    TTuple,
    TNumber,
    TString,
    TBoolean,
    TDate,
    TFunction,
    TUnion, 
    TLiteral
} from "./spec"

/**
 * tests the left and right type for structural similarity. If this function
 * returns true, it means that the left type is compatiable with the right.
 * @param {TAny} left the left type.
 * @param {TAny} right the right type.
 * @returns {boolean}
 */
export function compare(left: TAny, right: TAny): boolean {
  if(left.type === "any"       || right.type === "any")       return true
  if(left.type === "string"    && right.type === "string")    return true
  if(left.type === "number"    && right.type === "number")    return true
  if(left.type === "null"      && right.type === "null")      return true
  if(left.type === "undefined" && right.type === "undefined") return true
  if(left.type === "boolean"   && right.type === "boolean")   return true
  if(left.type === "date"      && right.type === "date")      return true
  if(left.type === "function"  && right.type === "function")  return true
  if(left.type === "literal"   && right.type === "literal")   return (<TLiteral>left).value === (<TLiteral>right).value
  
  // Object
  if(left.type === "object" && right.type === "object") {
    let object_left   = <TObject>left
    let object_right  = <TObject>right
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
  if(left.type === "array" && right.type === "array") {
    let array_left   = <TArray>left
    let array_right  = <TArray>right
    return compare(array_left.items, array_right.items)
  }

  // Tuple
  if(left.type === "tuple" && right.type === "tuple") {
    let tuple_left   = <TTuple>left
    let tuple_right  = <TTuple>right
    if(tuple_left.items.length !== tuple_right.items.length) return false
    for(let i = 0; i < tuple_left.items.length; i++) {
      if(compare(tuple_left.items[i], tuple_right.items[i]) === false) {
        return false
      }
    } return true
  }

  // union:zero length for left and right.
  if(left.type === "union" && right.type === "union") {
    let union_left   = <TUnion>left
    let union_right  = <TUnion>right
    if(union_left.items.length === 0 && union_right.items.length === 0) {
      return true
    }
  }

  // union:left
  if(left.type === "union") {
    let union_left   = <TUnion>left
    for(let i = 0; i < union_left.items.length; i++) {
      if(compare(union_left.items[i], right) === true) {
        return true
      } 
    }
  }
  // union:right
  if(right.type === "union") {
    let union_right  = <TUnion>right
    for(let i = 0; i < union_right.items.length; i++) {
      if(compare(union_right.items[i], left) === true) {
        return true
      } 
    }
  } return false
}