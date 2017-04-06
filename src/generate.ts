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

function generate_Any(t: TAny): any {
  return {}
}
function generate_Null(t: TNull): any {
  return null
}
function generate_Undefined(t: TUndefined): any {
  return undefined
}
function generate_Object(t: TObject): any {
  return Object.keys(t.properties)
    .map(key => ({key: key, value: generate(t.properties[key])}))
    .reduce((acc, value) => {
      acc[value.key] = value.value
      return acc
    }, {})
}
function generate_Array(t: TArray): any[] {
  return [
    generate(t.items), 
    generate(t.items), 
    generate(t.items)
  ]
}
function generate_Tuple(t: TTuple): any[] {
  return t.items.map(type => generate(type))
}
function generate_Number(t: TNumber): number {
  return 0
}
function generate_String(t: TString): string {
  return "string"
}
function generate_Boolean(t: TBoolean): boolean {
  return true
}
function generate_Date(t: TDate): Date {
  return new Date()
}
function generate_Function(t: TFunction): any {
  return function() {}
}
function generate_Union(t: TUnion): any {
  if(t.items.length === 0) {
    return {}
  } else {
    return generate(t.items[0])
  }
}
function generate_Literal(t: TLiteral): any {
  return t.value
}

/**
 * generates a example value from the given type.
 * @param {TAny} t the type to generate.
 * @returns {any}
 */
export function generate(t: TAny): any {
    switch (t.type) {
      case "any":       return generate_Any       (t as TAny)
      case "null":      return generate_Null      (t as TNull)
      case "undefined": return generate_Undefined (t as TUndefined)
      case "object":    return generate_Object    (t as TObject)
      case "array":     return generate_Array     (t as TArray)
      case "tuple":     return generate_Tuple     (t as TTuple)
      case "number":    return generate_Number    (t as TNumber)
      case "string":    return generate_String    (t as TString)
      case "boolean":   return generate_Boolean   (t as TBoolean)
      case "date":      return generate_Date      (t as TDate)
      case "function":  return generate_Function  (t as TFunction)
      case "union":     return generate_Union     (t as TUnion)
      case "literal":   return generate_Literal   (t as TLiteral)
      default: throw Error("unknown type.")
    }
}