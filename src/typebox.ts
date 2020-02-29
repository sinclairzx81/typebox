/*--------------------------------------------------------------------------

typebox - A json schema type builder with static type resolution for typescript.

The MIT License (MIT)

Copyright (c) 2018 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

// retlects the simple typename
type ReflectedTypeName = | "undefined" | "null" | "function" | "string" | "number" | "boolean" | "date" | "array" | "object"
function reflect(value: any): ReflectedTypeName {
  if (value === undefined) { return "undefined" }
  if (value === null) { return "null" }
  if (typeof value === "function") { return "function" }
  if (typeof value === "string") { return "string" }
  if (typeof value === "number") { return "number" }
  if (typeof value === "boolean") { return "boolean" }
  if (typeof value === "object") {
    if (value instanceof Array) { return "array" }
    if (value instanceof Date) { return "date" }
  }
  return "object"
}
// returns elements as distinct
function distinct(items: string[]): string[] {
  return items.reduce<string[]>((acc, c) => {
    if (acc.indexOf(c) === -1) { acc.push(c) }
    return acc
  }, [])
}

/** Static<T>: resolves a TBase<T> to a static typescript type. */
export type Static<T extends TBase<any>> = T["static"]

export type TLiteralType = number | string | boolean

export interface TBase<T> {
  static: T
  optional?: boolean
}

export interface TAny extends TBase<any> {}
export interface TNever extends TBase<never> {}
export interface TUndefined extends TBase<undefined> {}
export interface TNull extends TBase<null> { type: "null" }
export interface TLiteral<T extends TLiteralType> extends TBase<T> { type: TLiteralType, enum: [T] }
export interface TString extends TBase<string> { type: "string" }
export interface TPattern extends TBase<string> { type: "string", pattern: string }
export interface TNumber extends TBase<number> { type: "number" }
export interface TRange extends TBase<number> { type: "number",  minimum: number, maximum: number }
export interface TBoolean extends TBase<boolean> { type: "boolean" }
export interface TOptional<T extends TBase<any>> extends TBase<Static<T>> { }
export type TObjectProperties = { [K in string]: TBase<any> }
export interface TObject<T extends TObjectProperties> extends TBase<{ [K in keyof T]: Static<T[K]> }> { type: "object", properties: T, required: string[] }
export interface TDictionary<T extends TBase<any>> extends TBase<{ [key: string]: Static<T> }> {
  type: 'object'
  additionalProperties: T
}
export interface TArray<T extends TBase<any>> extends TBase<Array<Static<T>>> { type: "array", items: T }
export interface TTuple1<T1 extends TBase<any>> extends TBase<[Static<T1>]> {
  type: "array"
  items: [T1]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TTuple2<T1 extends TBase<any>, T2 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>]> {
  type: "array"
  items: [T1, T2]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TTuple3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>]> {
  type: "array"
  items: [T1, T2, T3]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TTuple4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>]> {
  type: "array"
  items: [T1, T2, T3, T4]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TTuple5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>]> {
  type: "array"
  items: [T1, T2, T3, T4, T5]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TTuple6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>, Static<T6>]> {
  type: "array"
  items: [T1, T2, T3, T4, T5, T6]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TTuple7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>, Static<T6>, Static<T7>]> {
  type: "array"
  items: [T1, T2, T3, T4, T5, T6, T7]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TTuple8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase<[Static<T1>, Static<T2>, Static<T3>, Static<T4>, Static<T5>, Static<T6>, Static<T7>, Static<T8>]> {
  type: "array"
  items: [T1, T2, T3, T4, T5, T6, T7, T8]
  additionalItems: false
  minItems: number
  maxItems: number
}
export interface TEnum1<T1 extends TLiteralType> extends TBase<T1> {
  type: TLiteralType
  enum: [T1]
}
export interface TEnum2<T1 extends TLiteralType, T2 extends TLiteralType> extends TBase<T1 | T2> {
  type: TLiteralType
  enum: [T1, T2]
}
export interface TEnum3<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType> extends TBase<T1 | T2 | T3> {
  type: TLiteralType
  enum: [T1, T2, T3]
}
export interface TEnum4<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4> {
  type: TLiteralType
  enum: [T1, T2, T3, T4]
}
export interface TEnum5<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5> {
  type: TLiteralType
  enum: [T1, T2, T3, T4, T5]
}
export interface TEnum6<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5 | T6> {
  type: TLiteralType
  enum: [T1, T2, T3, T4, T5, T6]
}
export interface TEnum7<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5 | T6 | T7> {
  type: TLiteralType
  enum: [T1, T2, T3, T4, T5, T6, T7]
}
export interface TEnum8<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType, T8 extends TLiteralType> extends TBase<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8> {
  type: TLiteralType
  enum: [T1, T2, T3, T4, T5, T6, T7, T8]
}
export interface TTUnion1<T1 extends TBase<any>> extends TBase<Static<T1>> {
  anyOf: [T1]
}
export interface TTUnion2<T1 extends TBase<any>, T2 extends TBase<any>>
  extends TBase<Static<T1> | Static<T2>> {
  anyOf: [T1, T2]
}
export interface TTUnion3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3>> {
  anyOf: [T1, T2, T3]
}
export interface TTUnion4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4>> {
  anyOf: [T1, T2, T3, T4]
}
export interface TTUnion5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5>> {
  anyOf: [T1, T2, T3, T4, T5]
}
export interface TTUnion6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6>> {
  anyOf: [T1, T2, T3, T4, T5, T6]
}
export interface TTUnion7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6> | Static<T7>> {
  anyOf: [T1, T2, T3, T4, T5, T6, T7]
}
export interface TTUnion8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase<Static<T1> | Static<T2> | Static<T3> | Static<T4> | Static<T5> | Static<T6> | Static<T7> | Static<T8>> {
  anyOf: [T1, T2, T3, T4, T5, T6, T7, T8]
}
export interface TIntersect1<T1 extends TBase<any>> extends TBase<Static<T1>> {
  allOf: [T1]
}
export interface TIntersect2<T1 extends TBase<any>, T2 extends TBase<any>>
  extends TBase<Static<T1> & Static<T2>> {
  allOf: [T1, T2]
}
export interface TIntersect3<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3>> {
  allOf: [T1, T2, T3]
}
export interface TIntersect4<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4>> {
  allOf: [T1, T2, T3, T4]
}
export interface TIntersect5<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5>> {
  allOf: [T1, T2, T3, T4, T5]
}
export interface TIntersect6<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>> extends TBase<Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6>> {
  allOf: [T1, T2, T3, T4, T5, T6]
}
export interface TIntersect7<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>> extends TBase< Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6> & Static<T7>> {
  allOf: [T1, T2, T3, T4, T5, T6, T7]
}
export interface TIntersect8<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>> extends TBase< Static<T1> & Static<T2> & Static<T3> & Static<T4> & Static<T5> & Static<T6> & Static<T7> & Static<T8>> {
  allOf: [T1, T2, T3, T4, T5, T6, T7, T8]
}

class TypeBuilder {
  /** Creates a json schema any type. Statically resolves to type 'any' */
  public Any(): TAny {
    return { } as TAny
  }
  /** Creates a json schema null type. Statically resolves to type 'null' */
  public Null(): TNull {
    return { type: "null" } as TNull
  }
  /** Creates a json schema number type. Statically resolves to type 'number' */
  public Number(): TNumber {
    return { type: "number" } as TNumber
  }
  /** Creates a json schema string type. Statically resolves to type 'string' */
  public String(): TString {
    return { type: "string" } as TString
  }
  /** Creates a json schema boolean type. Statically resolves to type 'boolean' */
  public Boolean(): TBoolean {
    return { type: "boolean" } as TBoolean
  }
  /** creates boolean literal value. Statically resolves to the given type 'boolean' */
  public Literal(value: boolean): TBoolean
  /** creates string literal value. Statically resolves to the given type 'string' */
  public Literal(value: string): TString
  /** creates number literal value. Statically resolves to the given type 'number' */
  public Literal(value: number): TNumber
  /** Creates a json schema literal validator for the given literal value. Statically resolves to the given type 'boolean' or 'string' or 'number' */
  public Literal<T extends TLiteralType>(value: T): TString | TNumber | TBoolean {
    const type = reflect(value)
    switch (type) {
      case 'number':
        return ({ type, enum: [value] } as any) as TNumber
      case 'boolean':
        return ({ type, enum: [value] } as any) as TBoolean
      case 'string':
        return ({ type, enum: [value] } as any) as TString
      default:
        throw Error('Literal only allows for string, number and boolean values.')
    }
  }
  /** Creates a json schema optional validator. Statically resolves to a T | undefined only when wrapped in an object. */
  public Optional<T extends TBase<any>>(value: T): TOptional<T | TUndefined> {
    return Object.assign({optional: true}, value) as TOptional<T | TUndefined>
  }
  /** Creates a json schema object. Statically resolves to an object of the given property types. */
  public Object<T extends TObjectProperties>(properties: T = {} as T): TObject<T> {
    const required = Object.keys(properties).filter((key) => {
      const type = properties[key]
      return type.optional === undefined || type.optional === false
    })
    return { type: "object", properties, required } as TObject<T>
  }
  /** Creates a json schema dictionary with string keys. Statically resolves to an TDictionary<T> */
  public Dictionary<T extends TBase<any>>(type: T = (undefined as any) as T): TDictionary<T> {
    return { type: 'object', additionalProperties: type } as TDictionary<T>
  }
  /** Creates a json schema array. Statically resolves to an Array<T> */
  public Array<T extends TBase<any>>(type: T = undefined as any as T): TArray<T> {
    return { type: "array", items: type === undefined ? { } : type } as TArray<T>
  }
  /** Creates a json schema range validator. Statically resolves to type 'number' */
  public Range(minimum: number, maximum: number): TNumber {
    return { type: "number", minimum, maximum } as any as TNumber
  }
  /** Creates a json schema pattern validator. Statically resolves to type 'string' */
  public Pattern(regex: RegExp): TString {
    return { type: "string", pattern: regex.source } as any as TString
  }
  /** Creates a json schema string with format 'date-time'. Statically resolves to type 'string' */
  public DateTime(): TString {
    return { type: "string", format: "date-time" } as any as TString
  }
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>>(t1: T1): TTuple1<T1>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>, T2 extends TBase<any>>(t1: T1, t2: T2): TTuple2<T1, T2>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>>(t1: T1, t2: T2, t3: T3): TTuple3<T1, T2, T3>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4): TTuple4<T1, T2, T3, T4>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TTuple5<T1, T2, T3, T4, T5>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TTuple6<T1, T2, T3, T4, T5, T6>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TTuple7<T1, T2, T3, T4, T5, T6, T7>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TTuple8<T1, T2, T3, T4, T5, T6, T7, T8>
  /** Creates a json schema tuple validator. Statically resolves to type '[T1, T2, T3, ...]' */
  public Tuple(...items: any[]) {
    if (items.length === 0) {
      throw Error("Type tuple requires at least one type.")
    }
    const additionalItems = false
    const minItems = items.length
    const maxItems = items.length
    return { type: "array", items, additionalItems, minItems, maxItems }
  }
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType>(t1: T1): TEnum1<T1>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType, T2 extends TLiteralType>(t1: T1, t2: T2): TEnum2<T1, T2>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType>(t1: T1, t2: T2, t3: T3): TEnum3<T1, T2, T3>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4): TEnum4<T1, T2, T3, T4>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TEnum5<T1, T2, T3, T4, T5>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TEnum6<T1, T2, T3, T4, T5, T6>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TEnum7<T1, T2, T3, T4, T5, T6, T7>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum<T1 extends TLiteralType, T2 extends TLiteralType, T3 extends TLiteralType, T4 extends TLiteralType, T5 extends TLiteralType, T6 extends TLiteralType, T7 extends TLiteralType, T8 extends TLiteralType>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TEnum8<T1, T2, T3, T4, T5, T6, T7, T8>
  /** Creates a json schema enum validator for the given literal values. Statically resolves to a type union for the given types */
  public Enum(...items: TLiteralType[]) {
    if (items.length === 0) {
      throw Error("Enum types must have at least one value.")
    }
    const typenames = items.map((item) => reflect(item))
    if (distinct(typenames).length > 1) {
      throw Error("Enum types must all be of the same literal type.")
    }
    const typename = typenames[0]
    switch (typename) {
      case "number":  return { type: "number", enum: items } as any
      case "boolean": return { type: "boolean", enum: items } as any
      case "string":  return { type: "string", enum: items } as any
      default: throw Error("enum types only allows for string, number and boolean values.")
    }
  }
  /** Creates a json schema union (anyOf) validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>>(t1: T1): TTUnion1<T1>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>, T2 extends TBase<any>>(t1: T1, t2: T2): TTUnion2<T1, T2>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>>(t1: T1, t2: T2, t3: T3): TTUnion3<T1, T2, T3>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4): TTUnion4<T1, T2, T3, T4>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TTUnion5<T1, T2, T3, T4, T5>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TTUnion6<T1, T2, T3, T4, T5, T6>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>>( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TTUnion7<T1, T2, T3, T4, T5, T6, T7>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TTUnion8<T1, T2, T3, T4, T5, T6, T7, T8>
  /** Creates a json schema union validator for the given types. Statically resolves to a type union. */
  public Union(...types: any[]) {
    if (types.length === 0) {
      throw Error("Type TUnion requires at least one type.")
    }
    return { anyOf: types }
  }
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>>(t1: T1): TIntersect1<T1>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>, T2 extends TBase<any>>(t1: T1, t2: T2): TIntersect2<T1, T2>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>>(t1: T1, t2: T2, t3: T3): TIntersect3<T1, T2, T3>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4): TIntersect4<T1, T2, T3, T4>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TIntersect5<T1, T2, T3, T4, T5>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6 ): TIntersect6<T1, T2, T3, T4, T5, T6>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>>( t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TIntersect7<T1, T2, T3, T4, T5, T6, T7>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect<T1 extends TBase<any>, T2 extends TBase<any>, T3 extends TBase<any>, T4 extends TBase<any>, T5 extends TBase<any>, T6 extends TBase<any>, T7 extends TBase<any>, T8 extends TBase<any>>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): TIntersect8<T1, T2, T3, T4, T5, T6, T7, T8>
  /** Creates a json schema intersect (allOf) validator for the given types. Statically resolves to a type intersect. */
  public Intersect(...types: Array<TBase<any>>) {
    if (types.length === 0) {
      throw Error("Type intersect requires at least one type.")
    }
    return { allOf: types }
  }
}

const Builder = new TypeBuilder()

export { Builder as Type }
