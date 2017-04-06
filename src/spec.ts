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

export interface TAny {
    type: "any" | "null" | "undefined" | "object" | "array" | "tuple" | "number" | "string" | "boolean" | "date" | "function" | "union" | "literal"
}

export interface TNull extends TAny {
    type: "null"
}

export interface TUndefined extends TAny {
    type: "undefined"
}

export interface TObjectProperties {
    [name: string]: TAny
}

export interface TObject extends TAny {
    type: "object"
    properties: TObjectProperties
}

export interface TArray extends TAny {
    type: "array",
    items: TAny
}
export interface TTuple extends TAny {
    type: "tuple",
    items: TAny[]
}

export interface TNumber extends TAny {
    type: "number"
}

export interface TString extends TAny {
    type: "string"
}

export interface TBoolean extends TAny {
    type: "boolean"
}

export interface TDate extends TAny {
    type: "date"
}

export interface TFunction extends TAny {
    type: "function"
}

export interface TUnion extends TAny {
    type: "union",
    items: TAny[]
}

export interface TLiteral extends TAny {
    type: "literal"
    value: number | string
}

/**
 * creates a new any type.
 * @returns {TAnything}
 */
export function Any(): TAny {
    return {
        type: "any"
    }
}
/**
 * creates a new null type.
 * @returns {TNull}
 */
export function Null(): TNull {
    return {
        type: "null"
    }
}
/**
 * creates a new undefined type.
 * @returns {TUndefined}
 */
export function Undefined(): TUndefined {
    return {
        type: "undefined"
    }
}
/**
 * creates a new complex type.
 * @param {TObjectProperties} properties the properties for this object.
 * @returns {TObject}
 */
export function Object(properties: TObjectProperties = {}): TObject {
    return {
        type: "object",
        properties: properties
    }
}
/**
 * creates a new array type.
 * @param {TAny | undefined} the type of this array (no arguments defaults to any)
 * @returns {TArray}
 */
export function Array(items: TAny = Any()): TArray {
    return {
        type: "array",
        items: items || { type: "any" }
    }
}

/**
 * creates a new tuple type.
 * @param {TAny[]} items the tuple types.
 * @returns {TTuple}
 */
export function Tuple(...items: TAny[]): TTuple {
    return {
        type: "tuple",
        items: items
    }
}

/**
 * creates a new number type.
 * @returns {TNumber}
 */
export function Number(): TNumber {
    return {
        type: "number"
    }
}

/**
 * creates a new string type.
 * @returns {TString}
 */
export function String(): TString {
    return {
        type: "string"
    }
}
/**
 * creates a new boolean type.
 * @returns {TBoolean}
 */
export function Boolean(): TBoolean {
    return {
        type: "boolean"
    }
}

/**
 * creates a new date type.
 * @returns {TDate}
 */
export function Date(): TDate {
    return {
        type: "date"
    }
}

/**
 * creates a new function type.
 * @returns {TFunction}
 */
export function Function(): TFunction {
    return {
        type: "function"
    }
}

/**
 * creates a new union type.
 * @param {TAny[]} items the types for this union.
 * @returns {TUnion}
 */
export function Union(...items: TAny[]): TUnion {
    return {
        type: "union",
        items: items
    }
}

/**
 * creates a new literal type.
 * @param {string | number} value the string or number literal value.
 * @returns {TLiteral}
 */
export function Literal(value: string | number): TLiteral {
    let typename = reflect(value)
    if(typename !== "string" && typename !== "number"){
        throw Error("literal can only access string or numeric values.")
    }
    return {
        type: "literal",
        value: value
    }
}