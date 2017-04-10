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

/**
 * Static<T>: resolves a TBase<T> to a static typescript type.
 */
export type Static<T extends TBase<any>> = T["phantom"]

/**
 * TBase<T>: base type for all supported types.
 */
export interface TBase<T> {
  kind: "any" | "undefined" | "null" | "literal" | "string" | "number" | "boolean" | "object" | "array" | "tuple" | "union" | "intersect"
  phantom: T
}

/**
 * TAny: represents a any type.
 */
export interface TAny extends TBase<any> {
  kind: "any"
}

/**
 * TUndefined: represents a undefined type.
 */
export interface TUndefined extends TBase<undefined> {
  kind: "undefined"
}

/**
 * TNull: represents a null type.
 */
export interface TNull extends TBase<null> {
  kind: "null"
}

/**
 * TLiteralType: type constraint for TLiteral.
 */
export type TLiteralType = number | string

/**
 * TLiteral: represents a literal value type.
 */
export interface TLiteral<T extends TLiteralType> extends TBase<T> {
  kind : "literal"
  value: T
}

/**
 * TString: represents a string type.
 */
export interface TString extends TBase<string> {
  kind: "string"
}

/**
 * TNumber: represents a number type.
 */
export interface TNumber extends TBase<number> {
  kind: "number"
}

/**
 * TBoolean: represents a boolean type.
 */
export interface TBoolean extends TBase<boolean> {
  kind: "boolean"
}

/**
 * TObjectProperties: TObject type parameter constraint.
 */
export type TObjectProperties = {[key in string]: TBase<any>}

/**
 * TObject: represents a complex type.
 */
export interface TObject<T extends TObjectProperties> extends TBase<{[K in keyof T]: Static<T[K]>}> {
  kind: "object"
  properties: T
}

/**
 * TArray: represents an array type.
 */
export interface TArray<T extends TBase<any>> extends TBase<Array<Static<T>>> {
  kind: "array"
  type: T
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple1<T1 extends TBase<any>> extends TBase<[Static<T1>]> {
  kind: "tuple"
  types: [T1]
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple2<T1 extends TBase<any>, T2 extends TBase<any>> extends TBase<[Static<T1>,  Static<T2>]> {
  kind: "tuple"
  types: [T1, T2]
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>]> {
  kind: "tuple"
  types: [T1, T2, T3]
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>]> {
  kind: "tuple"
  types: [T1, T2, T3, T4]
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>]> {
  kind: "tuple"
  types: [T1, T2, T3, T4, T5]
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>, Static<T6>]> {
  kind: "tuple"
  types: [T1, T2, T3, T4, T5, T6]
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>, Static<T6>, Static<T7>]> {
  kind: "tuple"
  types: [T1, T2, T3, T4, T5, T6, T7]
}

/**
 * Tuple<...T>: represents a tuple type.
 */
export interface TTuple8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>, Static<T6>, Static<T7>, Static<T8>]> {
  kind: "tuple"
  types: [T1, T2, T3, T4, T5, T6, T7, T8]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion1<T1 extends TBase<any>> extends TBase<Static<T1>> {
  kind: "union"
  types: [T1]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion2<T1 extends TBase<any>, T2 extends TBase<any>> extends TBase<Static<T1> | Static<T2>> {
  kind: "union"
  types: [T1, T2]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3>> {
  kind: "union"
  types: [T1, T2, T3]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4>> {
  kind: "union"
  types: [T1, T2, T3, T4]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5>> {
  kind: "union"
  types: [T1, T2, T3, T4, T5]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6>> {
  kind: "union"
  types: [T1, T2, T3, T4, T5, T6]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6> | Static<T7>> {
  kind: "union"
  types: [T1, T2, T3, T4, T5, T6, T7]
}

/**
 * TUnion<...T>: represents a union type.
 */
export interface TUnion8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6> | Static<T7> | Static<T8>> {
  kind: "union"
  types: [T1, T2, T3, T4, T5, T6, T7, T8]
}

/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect1<T1 extends TBase<any>> extends TBase<Static<T1>> {
  kind: "intersect"
  types: [T1]
}

/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect2<T1 extends TBase<any>, T2 extends TBase<any>> extends TBase<Static<T1> & Static<T2>> {
  kind: "intersect"
  types: [T1, T2]
}

/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3>> {
  kind: "intersect"
  types: [T1, T2, T3]
}
/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4>> {
  kind: "intersect"
  types: [T1, T2, T3, T4]
}

/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5>> {
  kind: "intersect"
  types: [T1, T2, T3, T4, T5]
}

/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6>> {
  kind: "intersect"
  types: [T1, T2, T3, T4, T5, T6]
}

/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6> & Static<T7>> {
  kind: "intersect"
  types: [T1, T2, T3, T4, T5, T6, T7]
}

/**
 * TIntersect<...T>: represents a intersect type.
 */
export interface TIntersect8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6> & Static<T7> & Static<T8>> {
  kind: "intersect"
  types: [T1, T2, T3, T4, T5, T6, T7, T8]
}

/**
 * creates a any type.
 * @returns {TAny}
 */
export function Any(): TAny {
  return {
    kind: "any"
  } as TAny
}
/**
 * creates a undefined type.
 * @returns {TUndefined}
 */
export function Undefined(): TUndefined {
  return {
    kind: "undefined"
  } as TUndefined
}
/**
 * creates a null type.
 * @returns {TNull}
 */
export function Null(): TNull {
  return {
    kind: "null"
  } as TNull
}

/**
 * creates a new literal type.
 * @param {T} value the value for this literal.
 * @returns {TLiteral<T>}
 */
export function Literal<T extends TLiteralType>(value: T): TLiteral<T> {
  if (typeof value !== "string" && typeof value !== "number")
    throw Error("Literal only allows for string or numeric values.")
  return {
    kind: "literal",
    value: value
  } as TLiteral<T>
}

/**
 * creates a string type.
 * @returns {TString}
 */
export function String(): TString {
  return {
    kind: "string"
  } as TString
}

/**
 * creates a number type.
 * @returns {TNumber}
 */
export function Number(): TNumber {
  return {
    kind: "number"
  } as TNumber
}

/**
 * creates a boolean type.
 * @returns {TBoolean}
 */
export function Boolean(): TBoolean {
  return {
    kind: "boolean"
  } as TBoolean
}
/**
 * creates a object type.
 * @param {TObjectProperties} properties the properties for this complex type.
 * @returns {TObject<T>}
 */
export function Object<T extends TObjectProperties>(properties: T = {} as T): TObject<T> {
  return {
    kind      : "object",
    properties: properties
  } as TObject<T>
}

/**
 * creates an array type. 
 * @param {TBase<any>} type the type of this array.
 * @returns {TArray<T>} 
 */
export function Array<T extends TBase<any>>(type: T = Any() as T): TArray<T> {
  return {
    kind: "array",
    type: type
  } as TArray<T>
}

/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>>(t1: T1): TTuple1<T1>

/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>, T2 extends TBase<any>>(t1: T1, t2: T2): TTuple2<T1, T2>
/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>>(t1: T1, t2: T2, t3: T3): TTuple3<T1, T2, T3>
/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4): TTuple4<T1, T2, T3, T4>
/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TTuple5<T1, T2, T3, T4, T5>
/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TTuple6<T1, T2, T3, T4, T5, T6>
/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TTuple7<T1, T2, T3, T4, T5, T6, T7>
/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TTuple8<T1, T2, T3, T4, T5, T6, T7, T8>
/**
 * creates a tuple type.
 * @returns {TTuple}
 */
export function Tuple(...types: Array<any>) {
  if(types.length === 0) throw Error("Type tuple requires at least one type.")
  return {
    kind: "tuple",
    types: types
  }
}

/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>>(t1: T1): TUnion1<T1>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>, T2 extends TBase<any>>(t1: T1, t2: T2): TUnion2<T1, T2>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>>(t1: T1, t2: T2, t3: T3): TUnion3<T1, T2, T3>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4): TUnion4<T1, T2, T3, T4>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TUnion5<T1, T2, T3, T4, T5>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TUnion6<T1, T2, T3, T4, T5, T6>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TUnion7<T1, T2, T3, T4, T5, T6, T7>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TUnion8<T1, T2, T3, T4, T5, T6, T7, T8>
/**
 * creates a union type.
 * @returns {TUnion}
 */
export function Union(...types: Array<any>) {
  if(types.length === 0) throw Error("Type union requires at least one type.")
  return {
    kind: "union",
    types: types
  }
}