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
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Any(type: spec.TAny): any {
  return {}
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Null(type: spec.TNull): any {
  return null
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Undefined(type: spec.TUndefined): any {
  return undefined
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Complex(type: spec.TComplex<spec.TComplexProperties>): any {
  return Object.keys(type.properties)
    .map(key => ({ key: key, value: generate(type.properties[key]) }))
    .reduce((acc, value) => {
      acc[value.key] = value.value
      return acc
    }, {})
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Array(t: spec.TArray<spec.TBase<any>>): any[] {
  return [
    generate(t.type),
    generate(t.type),
    generate(t.type)
  ]
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Tuple(t: spec.TTuple1<spec.TBase<any>>): any[] {
  return t.types.map(type => generate(type))
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Number(t: spec.TNumber): number {
  return 0
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_String(t: spec.TString): string {
  return "string"
}

/**
 * generates a any type.
 * @param {TAny} type the type.
 * @returns {any}
 */
function generate_Boolean(t: spec.TBoolean): boolean {
  return true
}

/**
 * generates a union type
 * @param {TAny} t the union type.
 * @returns {any}
 */
function generate_Union(t: spec.TUnion1<spec.TBase<any>>): any {
  if (t.types.length === 0) {
    return {}
  } else {
    return generate(t.types[0])
  }
}

/**
 * generates a literal type.
 * @param t 
 */
function generate_Literal(t: spec.TLiteral<spec.TLiteralType>): any {
  return t.value
}

/**
 * generates a example value from the given type.
 * @param {TAny} t the type to generate.
 * @returns {any}
 */
export function generate(type: spec.TBase<any>): any {
  switch (type.kind) {
    case "any":       return generate_Any      (type as spec.TAny)
    case "null":      return generate_Null     (type as spec.TNull)
    case "undefined": return generate_Undefined(type as spec.TUndefined)
    case "complex":   return generate_Complex  (type as spec.TComplex<spec.TComplexProperties>)
    case "array":     return generate_Array    (type as spec.TArray<spec.TBase<any>>)
    case "tuple":     return generate_Tuple    (type as spec.TTuple1<spec.TBase<any>>)
    case "number":    return generate_Number   (type as spec.TNumber)
    case "string":    return generate_String   (type as spec.TString)
    case "boolean":   return generate_Boolean  (type as spec.TBoolean)
    case "union":     return generate_Union    (type as spec.TUnion1<spec.TBase<any>>)
    case "literal":   return generate_Literal  (type as spec.TLiteral<spec.TLiteralType>)
    default: throw Error("unknown type.")
  }
}