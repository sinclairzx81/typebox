/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

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

import * as G from './guard.ts'

// ------------------------------------------------------------------
// Identifier
// ------------------------------------------------------------------
const identifierRegExp = /^[\p{ID_Start}_$][\p{ID_Continue}_$\u200C\u200D]*$/u

/** Returns true if this value is a valid JavaScript identifier */
function IsIdentifier(value: string): boolean {
  return identifierRegExp.test(value)
}
// ------------------------------------------------------------------
// Logical
// ------------------------------------------------------------------
export function And(left: string, right: string): string {
  return `(${left} && ${right})`
}
export function Or(left: string, right: string): string {
  return `(${left} || ${right})`
}
export function Not(expr: string): string {
  return `!(${expr})`
}
// --------------------------------------------------------------------------
// Guards
// --------------------------------------------------------------------------
/** Returns true if this value is an array */
export function IsArray(value: string): string {
  return `Array.isArray(${value})`
}
/** Returns true if this value is an async iterator */
export function IsAsyncIterator(value: unknown): string {
  return `Guard.IsAsyncIterator(${value})`
}
/** Returns true if this value is bigint */
export function IsBigInt(value: string): string {
  return `typeof ${value} === "bigint"`
}
/** Returns true if this value is a boolean */
export function IsBoolean(value: string): string {
  return `typeof ${value} === "boolean"`
}
/** Returns true if this value is integer */
export function IsInteger(value: string): string {
  return `Number.isInteger(${value})`
}
/** Returns true if this value is an iterator */
export function IsIterator(value: unknown): string {
  return `Guard.IsIterator(${value})`
}
/** Returns true if this value is null */
export function IsNull(value: string): string {
  return `${value} === null`
}
/** Returns true if this value is number */
export function IsNumber(value: string): string {
  return `Number.isFinite(${value})`
}
/** Returns true if this value is an object but not an array */
export function IsObjectNotArray(value: string): string {
  return And(IsObject(value), Not(IsArray(value)))
}
/** Returns true if this value is an object */
export function IsObject(value: string): string {
  return `typeof ${value} === "object" && ${value} !== null`
}
/** Returns true if this value is string */
export function IsString(value: string): string {
  return `typeof ${value} === "string"`
}
/** Returns true if this value is symbol */
export function IsSymbol(value: string): string {
  return `typeof ${value} === "symbol"`
}
/** Returns true if this value is undefined */
export function IsUndefined(value: string): string {
  return `${value} === undefined`
}
// ------------------------------------------------------------------
// Functions and Constructors
// ------------------------------------------------------------------
export function IsFunction(value: unknown): string {
  return `typeof ${value} === "function"`
}
export function IsConstructor(value: unknown): string {
  return `Guard.IsConstructor(${value})`
}
// ------------------------------------------------------------------
// Relational
// ------------------------------------------------------------------
export function IsEqual(left: string, right: string): string {
  return `${left} === ${right}`
}
export function IsGreaterThan(left: string, right: string): string {
  return `${left} > ${right}`
}
export function IsLessThan(left: string, right: string): string {
  return `${left} < ${right}`
}
export function IsLessEqualThan(left: string, right: string): string {
  return `${left} <= ${right}`
}
export function IsGreaterEqualThan(left: string, right: string): string {
  return `${left} >= ${right}`
}
// --------------------------------------------------------------------------
// String
// --------------------------------------------------------------------------
export function IsMinLength(value: string, length: string): string {
  return `Guard.IsMinLength(${value}, ${length})`
}
export function IsMaxLength(value: string, length: string): string {
  return `Guard.IsMaxLength(${value}, ${length})`
}
// --------------------------------------------------------------------------
// Array
// --------------------------------------------------------------------------
export function Every(value: string, offset: string, params: [value: string, index: string], expression: string): string {
  return G.IsEqual(offset, '0')
    ? `${value}.every((${params[0]}, ${params[1]}) => ${expression})`
    : `((value, callback) => { for(let index = ${offset}; index < value.length; index++) if (!callback(value[index], index)) return false; return true })(${value}, (${params[0]}, ${params[1]}) => ${expression})`
}
// --------------------------------------------------------------------------
// Objects
// --------------------------------------------------------------------------
export function Entries(value: string): string {
  return `Object.entries(${value})`
}
export function Keys(value: string): string {
  return `Object.getOwnPropertyNames(${value})`
}
export function HasPropertyKey(value: string, key: string): string {
  const isProtoField = G.IsEqual(key, '"__proto__"') || G.IsEqual(key, '"constructor"')
  return isProtoField ? `Object.prototype.hasOwnProperty.call(${value}, ${key})` : `${key} in ${value}`
}
export function IsDeepEqual(left: string, right: string): string {
  return `Guard.IsDeepEqual(${left}, ${right})`
}
// ------------------------------------------------------------------
// Expressions
// ------------------------------------------------------------------
export function ArrayLiteral(elements: string[]): string {
  return `[${elements.join(', ')}]`
}
export function ArrowFunction(parameters: string[], body: string): string {
  return `((${parameters.join(', ')}) => ${body})`
}
export function Call(value: string, arguments_: string[]): string {
  return `${value}(${arguments_.join(', ')})`
}
export function New(value: string, arguments_: string[]): string {
  return `new ${value}(${arguments_.join(', ')})`
}
export function Member(left: string, right: string): string {
  return `${left}${IsIdentifier(right) ? `.${right}` : `[${Constant(right)}]`}`
}
export function Constant(value: bigint | boolean | null | number | string | undefined): string {
  return G.IsString(value) ? JSON.stringify(value) : `${value}`
}
export function Ternary(condition: string, true_: string, false_: string): string {
  return `(${condition} ? ${true_} : ${false_})`
}
// ------------------------------------------------------------------
// Statements
// ------------------------------------------------------------------
export function Statements(statements: string[]): string {
  return `{ ${statements.join('; ')}; }`
}
export function ConstDeclaration(identifier: string, expression: string): string {
  return `const ${identifier} = ${expression}`
}
export function If(condition: string, then: string): string {
  return `if(${condition}) { ${then} }`
}
export function Return(expression: string): string {
  return `return ${expression}`
}
// ------------------------------------------------------------------
// Logical
// ------------------------------------------------------------------
export function ReduceAnd(operands: string[]): string {
  return G.IsEqual(operands.length, 0) ? 'true' : operands.reduce((left, right) => And(left, right))
}
export function ReduceOr(operands: string[]): string {
  // deno-coverage-ignore - we never observe 0 operands
  return G.IsEqual(operands.length, 0) ? 'false' : operands.reduce((left, right) => Or(left, right))
}
// --------------------------------------------------------------------------
// Arithmetic
// --------------------------------------------------------------------------
export function PrefixIncrement(expression: string): string {
  return `++${expression}`
}
export function MultipleOf(dividend: string, divisor: string): string {
  return `Guard.IsMultipleOf(${dividend}, ${divisor})`
}
