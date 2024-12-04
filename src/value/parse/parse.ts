/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { TypeBoxError } from '../../type/error/index'
import { TransformDecode, TransformEncode, HasTransform } from '../transform/index'
import { TSchema } from '../../type/schema/index'
import { StaticDecode } from '../../type/static/index'
import { Assert } from '../assert/index'
import { Default } from '../default/index'
import { Convert } from '../convert/index'
import { Clean } from '../clean/index'
import { Clone } from '../clone/index'

// ------------------------------------------------------------------
// Guards
// ------------------------------------------------------------------
import { IsArray, IsUndefined } from '../guard/index'

// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export class ParseError extends TypeBoxError {
  constructor(message: string) {
    super(message)
  }
}

// ------------------------------------------------------------------
// ParseRegistry
// ------------------------------------------------------------------
export type TParseOperation = 'Clone' | 'Clean' | 'Default' | 'Convert' | 'Assert' | 'Decode' | 'Encode' | ({} & string)
export type TParseFunction = (type: TSchema, references: TSchema[], value: unknown) => unknown

// prettier-ignore
export namespace ParseRegistry {
  const registry = new Map<string, TParseFunction>([
    ['Clone', (_type, _references, value: unknown) => Clone(value)],
    ['Clean', (type, references, value: unknown) => Clean(type, references, value)],
    ['Default', (type, references, value: unknown) => Default(type, references, value)],
    ['Convert', (type, references, value: unknown) => Convert(type, references, value)],
    ['Assert', (type, references, value: unknown) => { Assert(type, references, value); return value }],
    ['Decode', (type, references, value: unknown) => (HasTransform(type, references) ? TransformDecode(type, references, value) : value)],
    ['Encode', (type, references, value: unknown) => (HasTransform(type, references) ? TransformEncode(type, references, value) : value)],
  ])
  // Deletes an entry from the registry
  export function Delete(key: string): void {
    registry.delete(key)
  }
  // Sets an entry in the registry
  export function Set(key: string, callback: TParseFunction): void {
    registry.set(key, callback)
  }
  // Gets an entry in the registry
  export function Get(key: string): TParseFunction | undefined {
    return registry.get(key)
  }
}
// ------------------------------------------------------------------
// Default Parse Sequence
// ------------------------------------------------------------------
// prettier-ignore
export const ParseDefault = [
  'Clone',
  'Clean',
  'Default',
  'Convert',
  'Assert',
  'Decode'
] as const

// ------------------------------------------------------------------
// ParseValue
// ------------------------------------------------------------------
function ParseValue<Type extends TSchema, Result extends StaticDecode<Type> = StaticDecode<Type>>(operations: TParseOperation[], type: Type, references: TSchema[], value: unknown): Result {
  return operations.reduce((value, operationKey) => {
    const operation = ParseRegistry.Get(operationKey)
    if (IsUndefined(operation)) throw new ParseError(`Unable to find Parse operation '${operationKey}'`)
    return operation(type, references, value)
  }, value) as Result
}

// ------------------------------------------------------------------
// Parse
// ------------------------------------------------------------------
/** Parses a value using the default parse pipeline. Will throws an `AssertError` if invalid. */
export function Parse<Type extends TSchema, Output = StaticDecode<Type>, Result extends Output = Output>(schema: Type, references: TSchema[], value: unknown): Result
/** Parses a value using the default parse pipeline. Will throws an `AssertError` if invalid. */
export function Parse<Type extends TSchema, Output = StaticDecode<Type>, Result extends Output = Output>(schema: Type, value: unknown): Result
/** Parses a value using the specified operations. */
export function Parse<Type extends TSchema>(operations: TParseOperation[], schema: Type, references: TSchema[], value: unknown): unknown
/** Parses a value using the specified operations. */
export function Parse<Type extends TSchema>(operations: TParseOperation[], schema: Type, value: unknown): unknown
/** Parses a value */
export function Parse(...args: any[]): unknown {
  // prettier-ignore
  const [operations, schema, references, value] = (
    args.length === 4 ? [args[0], args[1], args[2], args[3]] :
    args.length === 3 ? IsArray(args[0]) ? [args[0], args[1], [], args[2]] : [ParseDefault, args[0], args[1], args[2]] :
    args.length === 2 ? [ParseDefault, args[0], [], args[1]] :
    (() => { throw new ParseError('Invalid Arguments') })()
  )
  return ParseValue(operations, schema, references, value)
}
