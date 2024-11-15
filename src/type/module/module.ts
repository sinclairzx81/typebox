/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import { Assert, Ensure } from '../helpers/index'
import { CreateType } from '../create/index'
import { Kind } from '../symbols/index'
import { SchemaOptions, TSchema } from '../schema/index'
import { TObject, TProperties } from '../object/index'
import { TConstructor } from '../constructor/index'
import { TFunction } from '../function/index'
import { TTuple } from '../tuple/index'
import { TIntersect } from '../intersect/index'
import { TUnion } from '../union/index'
import { TArray } from '../array/index'
import { TAsyncIterator } from '../async-iterator/index'
import { TIterator } from '../iterator/index'
import { TLiteral, TLiteralValue } from '../literal/index'
import { TAny } from '../any/index'
import { TBigInt } from '../bigint/index'
import { TBoolean } from '../boolean/index'
import { TDate } from '../date/index'
import { TInteger } from '../integer/index'
import { TNever } from '../never/index'
import { TNumber } from '../number/index'
import { TNull } from '../null/index'
import { TRef } from '../ref/index'
import { TRegExp } from '../regexp/index'
import { TString } from '../string/index'
import { TSymbol } from '../symbol/index'
import { TTemplateLiteral, TTemplateLiteralKind } from '../template-literal/index'
import { TUint8Array } from '../uint8array/index'
import { TUndefined } from '../undefined/index'
import { TUnknown } from '../unknown/index'
import { TVoid } from '../void/index'
import { Static } from '../static/index'
import { TRecord } from '../record/index'

// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
// prettier-ignore
type InferImport<Properties extends TProperties, Key extends keyof Properties, ModuleProperties extends TProperties> = (
  Infer<Properties[Key], ModuleProperties>
)
// prettier-ignore
type InferRef<Ref extends string, Properties extends TProperties> = (
  Ref extends keyof Properties ? Infer<Properties[Ref], Properties> : never
)
// prettier-ignore
type InferObject<Properties extends TProperties, ModuleProperties extends TProperties> = { 
  [K in keyof Properties]: Infer<Properties[K], ModuleProperties> 
} & {}
// prettier-ignore
type InferRecord<Properties extends TSchema, S extends TSchema, ModuleProperties extends TProperties> = { 
  [_ in Assert<Static<Properties>, PropertyKey>]: Infer<S, ModuleProperties> 
} & {}
// prettier-ignore
type InferConstructor<Parameters extends TSchema[], InstanceType extends TSchema, Properties extends TProperties> = Ensure<
  new (...args: InferTuple<Parameters, Properties>) => Infer<InstanceType, Properties>
>
// prettier-ignore
type InferFunction<Parameters extends TSchema[], ReturnType extends TSchema, Properties extends TProperties> = Ensure<
  (...args: InferTuple<Parameters, Properties>) => Infer<ReturnType, Properties>
>
// prettier-ignore
type InferTuple<Types extends TSchema[], Properties extends TProperties, Result extends unknown[] = []> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? InferTuple<R, Properties, [...Result, Infer<L, Properties>]>
    : Result
)
// prettier-ignore
type InferIntersect<Types extends TSchema[], Properties extends TProperties, Result extends unknown = unknown> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? InferIntersect<R, Properties, Result & Infer<L, Properties>>
    : Result
)
// prettier-ignore
type InferUnion<Types extends TSchema[], Properties extends TProperties, Result extends unknown = never> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? InferUnion<R, Properties, Result | Infer<L, Properties>>
    : Result
)
// prettier-ignore
type InferArray<Type extends TSchema, Module extends TProperties> = (
  Ensure<Array<Infer<Type, Module>>>
)
// prettier-ignore
type InferAsyncIterator<Type extends TSchema, Properties extends TProperties> = (
  Ensure<AsyncIterableIterator<Infer<Type, Properties>>>
)
// prettier-ignore
type InferIterator<Type extends TSchema, Properties extends TProperties> = (
  Ensure<IterableIterator<Infer<Type, Properties>>>
)
// prettier-ignore
type Infer<Type extends TSchema, Properties extends TProperties = {}> = (
  Type extends TImport<infer S extends TProperties, infer K extends string> ? InferImport<S, K, S> :
  Type extends TRef<infer S extends string> ? InferRef<S, Properties> :
  Type extends TRecord<infer K extends TSchema, infer S extends TSchema> ? InferRecord<K, S, Properties> :
  Type extends TObject<infer S extends TProperties> ? InferObject<S, Properties> :
  Type extends TConstructor<infer S extends TSchema[], infer R extends TSchema> ? InferConstructor<S, R, Properties> :
  Type extends TFunction<infer S extends TSchema[], infer R extends TSchema> ? InferFunction<S, R, Properties> :
  Type extends TTuple<infer S extends TSchema[]> ? InferTuple<S, Properties> :
  Type extends TIntersect<infer S extends TSchema[]> ? InferIntersect<S, Properties> :
  Type extends TUnion<infer S extends TSchema[]> ? InferUnion<S, Properties> :
  Type extends TArray<infer S extends TSchema> ? InferArray<S, Properties> :
  Type extends TAsyncIterator<infer S extends TSchema> ? InferAsyncIterator<S, Properties> :
  Type extends TIterator<infer S extends TSchema> ? InferIterator<S, Properties> :
  Type extends TTemplateLiteral<infer S extends TTemplateLiteralKind[]> ? Static<TTemplateLiteral<S>> :
  Type extends TLiteral<infer S extends TLiteralValue> ? S :
  Type extends TAny ? any :
  Type extends TBigInt ? bigint :
  Type extends TBoolean ? boolean :
  Type extends TDate ? Date :
  Type extends TInteger ? number :
  Type extends TNever ? never :
  Type extends TNumber ? number :
  Type extends TRegExp ? string :
  Type extends TString ? string :
  Type extends TSymbol ? symbol :
  Type extends TNull ? null :
  Type extends TUint8Array ? Uint8Array :
  Type extends TUndefined ? undefined :
  Type extends TUnknown ? unknown :
  Type extends TVoid ? void :
  never
)
// ------------------------------------------------------------------
// Definitions
// ------------------------------------------------------------------
export interface TDefinitions<ModuleProperties extends TProperties> extends TSchema {
  static: { [K in keyof ModuleProperties]: Static<ModuleProperties[K]> }
  $defs: ModuleProperties
}
// ------------------------------------------------------------------
// Import
// ------------------------------------------------------------------
// prettier-ignore
export interface TImport<ModuleProperties extends TProperties = {}, Key extends keyof ModuleProperties = keyof ModuleProperties> extends TSchema {
  [Kind]: 'Import'
  static: InferImport<ModuleProperties, Key, ModuleProperties>
  $defs: ModuleProperties
  $ref: Key
}
// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
// prettier-ignore
export class TModule<Properties extends TProperties> {
  constructor(private readonly $defs: Properties, private readonly options: SchemaOptions = {}) {}
  
  /** `[Json]` Returns the Type definitions for this module */
  public Defs(): TDefinitions<Properties> {
    return CreateType({ $defs: this.ResolveDefinitionsWithIdentifiers() }, this.options) as never 
  }
  /** `[Json]` Imports a Type by Key. */
  public Import<Key extends keyof Properties>(key: Key, options?: SchemaOptions): TImport<Properties, Key> {
    return CreateType({ [Kind]: 'Import', $defs: this.ResolveDefinitionsWithIdentifiers(), $ref: key }, options) as never
  }
  /** `[Internal]` For each definition, assign an `$id` property. */
  private ResolveDefinitionsWithIdentifiers() {
    return globalThis.Object.getOwnPropertyNames(this.$defs).reduce((Result, Key) => (
      { ...Result, [Key]: { ...this.$defs[Key], $id: Key }}
    ), {})
  }
}
/** `[Json]` Creates a Type Definition Module. */
export function Module<Properties extends TProperties>(properties: Properties): TModule<Properties> {
  return new TModule(properties)
}
