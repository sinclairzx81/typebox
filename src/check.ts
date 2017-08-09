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

import { reflect } from "./reflect"
import * as spec from "./spec"


/**
 * TypeCheckError: encapsulates a type check error.
 */
export interface TypeCheckError {
  binding: string
  message: string
  expect : string
  actual : string
}

/**
 * TypeCheckResult: encapsulates a type check result.
 */
export interface TypeCheckResult {
  success: boolean
  errors : Array<TypeCheckError>
}

/**
 * creates a successful typecheck result.
 */
function Ok(): TypeCheckResult {
  return {
    success: true,
    errors : []
  }
}
/**
 * creates a failed typecheck result.
 */
function FailBinding(binding: string, expect: string, actual: string): TypeCheckResult {
  return {
    success: false,
    errors: [{
      binding: binding,
      message: `Type '${actual}' is not assignable to type '${expect}'`,
      expect : expect,
      actual : actual
    }]
  }
}

/**
 * creates a failed typecheck result.
 */
function FailRequired(binding: string, expect: string, actual: string): TypeCheckResult {
  return {
    success: false,
    errors: [{
      binding: binding,
      message: `Property of type '${expect}' is required`,
      expect : expect,
      actual : actual
    }]
  }
}

/**
 * creates a failed typecheck result.
 */
function FailLengthMismatch(binding: string, expect: string, actual: string, expect_length: number, actual_length: number): TypeCheckResult {
  return {
    success: false,
    errors: [{
      binding: binding,
      message: `Property of type '${actual}' with a length ${actual_length} is invalid. Expect length of ${expect_length}`,
      expect : expect,
      actual : actual
    }]
  }
}

/**
 * creates a failed typecheck result.
 */
function FailUnexpected(binding: string, expect: string, actual: string): TypeCheckResult {
  const parts = binding.split(".")
  const property = parts[parts.length - 1]
  return {
    success: false,
    errors: [{
      binding: binding,
      message: `Property of type '${actual}' is not valid for this object`,
      expect: expect,
      actual: actual
    }]
  }
}

/**
 * validates the given value against the given TAny type.
 * @param {TAny} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Any(type: spec.TAny, name: string, value: any): TypeCheckResult {
  return Ok()
}

/**
 * validates the given value against the given TUndefined type.
 * @param {TUndefined} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Undefined(type: spec.TUndefined, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  return (kind !== "undefined")
    ? FailBinding(name, type.kind, kind)
    : Ok()
}

/**
 * validates the given value against the given TNull type.
 * @param {TNull} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Null(type: spec.TNull, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  return (kind !== "null")
    ? FailBinding(name, type.kind, kind)
    : Ok()
}
/**
 * validates the given value against the given TLiteral type.
 * @param {TLiteral} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Literal(type: spec.TLiteral<spec.TLiteralType>, name: string, value: any): TypeCheckResult {
  const actual = reflect(value)
  const expect = reflect(type.value)
  if (actual !== expect) {
    return FailBinding(name, expect, actual)
  } else if (type.value !== value) {
    return FailBinding(name, type.value as string, actual)
  } else {
    return Ok()
  }
}
/**
 * validates the given value against the given TString type.
 * @param {TString} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_String(type: spec.TString, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  return (kind !== "string")
    ? FailBinding(name, type.kind, kind)
    : Ok()
}
/**
 * validates the given value against the given TNumber type.
 * @param {TNumber} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Number(type: spec.TNumber, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  return (kind !== "number")
    ? FailBinding(name, type.kind, kind)
    : Ok()
}
/**
 * validates the given value against the given TBoolean type.
 * @param {TBoolean} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Boolean(type: spec.TBoolean, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  return (kind !== "boolean")
    ? FailBinding(name, type.kind, kind)
    : Ok()
}

/**
 * validates the given value against the given TObject type.
 * @param {TObject} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Complex(type: spec.TComplex<spec.TComplexProperties>, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  if (kind !== "complex") {
    return FailBinding(name, type.kind, kind)
  } else {
    const results = new Array<TypeCheckResult>()

    // scan for unexpected properties.
    const unexpected_queue = Object.keys(value).map(key => ({ key: key, value: value[key] }));
    while (unexpected_queue.length > 0) {
      const property = unexpected_queue.shift()
      if (type.properties[property.key] === undefined) {
        results.push(
          FailUnexpected(name + "." + property.key, "undefined", reflect(property.value))
        )
      }
    }

    // scan for expected properties.
    const expected_queue = Object.keys(type.properties).map(key => ({ key: key, type: type.properties[key] }))
    while (expected_queue.length > 0) {
      const property = expected_queue.shift()
      if (value[property.key] === undefined && property.type.kind !== "undefined") {
        results.push(
          FailRequired(name + "." + property.key, property.type.kind, "undefined")
        )
      } else {
        results.push(
          check_All(property.type, name + "." + property.key, value[property.key])
        )
      }
    }

    // gather results.
    return results.reduce((acc, result) => {
      if (result.errors.length > 0)
        acc.success = false
      for (let i = 0; i < result.errors.length; i++)
        acc.errors.push(result.errors[i])
      return acc
    }, { success: true, errors: [] })
  }
}

/**
 * validates the given value against the given TArray type.
 * @param {TArray} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Array(type: spec.TArray<spec.TBase<any>>, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  if (kind !== "array") {
    return FailBinding(name, type.kind, kind)
  } else {
    const array = value as Array<any>
    return array.map((item, index) => check_All(type.type, name + `[${index}]`, item)).reduce((acc, result) => {
      if (result.errors.length > 0) {
        acc.success = false
      }
      for (let i = 0; i < result.errors.length; i++) {
        acc.errors.push(result.errors[i])
      }
      return acc
    }, { success: true, errors: [] })
  }
}

/**
 * validates the given value against the given TTuple1 type.
 * @param {TTuple1} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Tuple(type: spec.TTuple1<spec.TBase<any>>, name: string, value: any): TypeCheckResult {
  const kind = reflect(value)
  const array = value as Array<any>
  if (kind !== "array") {
    return FailBinding("name", type.kind, kind)
  } else if (array.length !== type.types.length) {
    return FailLengthMismatch(name, type.kind, kind, type.types.length, array.length)
  } else {
    return array.map((item, index) =>
      check_All(type.types[index], name + `[${index}]`, item)
    ).reduce((acc, c) => {
      if (c.errors.length > 0) {
        acc.success = false
      }
      for (let i = 0; i < c.errors.length; i++) {
        acc.errors.push(c.errors[i])
      }
      return acc
    }, { success: true, errors: [] })
  }
}

/**
 * validates the given value against the given TUnion1 type.
 * @param {TUnion1} type the type.
 * @param {string} the name of the property.
 * @param {string} the value to validate.
 * @returns {TypeCheckResult}
 */
function check_Union(type: spec.TUnion1<spec.TBase<any>>, name: string, value: any): TypeCheckResult {
  const results = type.types.map(type => check_All(type, name, value))
  // test for failed, we expect at least one to pass.
  const failed = results.reduce((acc, result) => {
    if (result.success === false) {
      acc += 1;
    } return acc
  }, 0)

  // if they all fail, then we need to resolve a error.
  if (failed === type.types.length) {
    const unionkind = type.types.map(type => {
      return type.kind === "literal"
        ? (<spec.TLiteral<spec.TLiteralType>>type).value
        : type.kind
    }).join(" | ")
    return FailBinding(name, unionkind, reflect(value))
  } else {
    return Ok()
  }
}


/**
 * typechecks the given value against the given type.
 * @param {T} type the type to check.
 * @param {any} value the value to check.
 * @returns {TypeCheckResult}
 */
function check_All(type: spec.TBase<any>, name: string, value: any): TypeCheckResult {
  switch (type.kind) {
    case "any":       return check_Any(type as spec.TAny, name, value)
    case "undefined": return check_Undefined(type as spec.TUndefined, name, value)
    case "null":      return check_Null(type as spec.TNull, name, value)
    case "literal":   return check_Literal(type as spec.TLiteral<spec.TLiteralType>, name, value)
    case "string":    return check_String(type as spec.TString, name, value)
    case "number":    return check_Number(type as spec.TNumber, name, value)
    case "boolean":   return check_Boolean(type as spec.TBoolean, name, value)
    case "complex":   return check_Complex(type as spec.TComplex<spec.TComplexProperties>, name, value)
    case "array":     return check_Array(type as spec.TArray<spec.TBase<any>>, name, value)
    case "tuple":     return check_Tuple(type as spec.TTuple1<spec.TBase<any>>, name, value)
    case "union":     return check_Union(type as spec.TUnion1<spec.TBase<any>>, name, value)
    default: throw new Error("unknown type.")
  }
}

/**
 * typechecks the given value against the given type.
 * @param {T} type the type to check.
 * @param {any} value the value to check.
 * @returns {TypeCheckResult}
 */
export function check(type: spec.TBase<any>, value: any): TypeCheckResult {
  return check_All(type, "value", value)
}