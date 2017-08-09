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

import {reflect} from "./reflect"
import * as spec from "./spec"

/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Any(type: spec.TAny): any {
  return { }
}
/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Undefined(type: spec.TUndefined): any {
  return { "type": "null" }
}

/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Null(type: spec.TNull): any {
  return { "type": "null" }
}

/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Literal(type: spec.TLiteral<spec.TLiteralType>): any {
  const kind = reflect(type.value)
  switch(kind) {
    case "string": return { "type": "string", "pattern": type.value  }
    case "number": return { "type": "number", "minimum": type.value, "maximum": type.value }
  }
}

/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_String(type: spec.TString): any {
  return { "type": "string" }
}
/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Number(type: spec.TNumber): any {
  return { "type": "number" }
}

/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Boolean(type: spec.TBoolean): any {
  return { "type": "boolean" }
}

/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Complex(type: spec.TComplex<spec.TComplexProperties>): any {
  const expanded  = Object.keys(type.properties).map(key => ({
    key: key,
    type: type.properties[key]
  }))
  
  const properties = expanded
  .reduce((acc, c) => {
    acc[c.key] = schema_Base(c.type)
    return acc
  }, {})

  const required = expanded
  .filter(property => property.type.kind !== "undefined")
  .map(property => property.key)

  return {
    "type": "object",
    "properties": properties,
    "required": required
  }
}
/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Array(type: spec.TArray<spec.TBase<any>>): any {
  return { 
    "type": "array",
    "items": schema_Base(type.type)
  }
}
/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Tuple(type: spec.TTuple1<spec.TBase<any>>): any {
  const items  = type.types.map(type => schema_Base(type))
  return {   
    "type": "array",
    "items"          : items,
    "additionalItems": false,
    "minItems": items.length,
    "maxItems": items.length
  }
}
/**
 * generates a json schema any type.
 * @param {spec.TAny} type the type
 * @returns {any}
 */
function schema_Union(type: spec.TUnion1<spec.TBase<any>>): any {
  const types = type.types.map(type => schema_Base(type))
  return {
    "anyOf": types
  }
}

/**
 * creates a JSONschema v4 document that validates to the given type.
 * @param {TBase<T>} the type.
 * @returns {any} the schema.
 */
function schema_Base(type: spec.TBase<any>): any {
  switch (type.kind) {
    case "any":       return schema_Any(type as spec.TAny)
    case "undefined": return schema_Undefined(type as spec.TUndefined)
    case "null":      return schema_Null(type as spec.TNull)
    case "literal":   return schema_Literal(type as spec.TLiteral<spec.TLiteralType>)
    case "string":    return schema_String(type as spec.TString)
    case "number":    return schema_Number(type as spec.TNumber)
    case "boolean":   return schema_Boolean(type as spec.TBoolean)
    case "complex":   return schema_Complex(type as spec.TComplex<spec.TComplexProperties>)
    case "array":     return schema_Array(type as spec.TArray<spec.TBase<any>>)
    case "tuple":     return schema_Tuple(type as spec.TTuple1<spec.TBase<any>>)
    case "union":     return schema_Union(type as spec.TUnion1<spec.TBase<any>>)
    default: throw new Error("unknown type.")
  }
}

/**
 * maps the given typebox type into JSONSchema.
 * @param {spec.TBase<any>} type the type to convert.
 * @returns {any}
 */
export function schema(type: spec.TBase<any>): any {
  const base = schema_Base(type)
  const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#"
  }
  return Object.keys(base).reduce((acc, key) => {
    acc[key] = base[key]
    return acc
  }, schema)
}