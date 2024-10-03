/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

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

import * as Types from '@sinclair/typebox'
import { Check } from '@sinclair/typebox/value'
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
// prettier-ignore
export type InferImport<Properties extends TModuleProperties, Key extends keyof Properties, Module extends TModuleProperties> = (
  Infer<Properties[Key], Module>
)
// prettier-ignore
export type InferModuleRef<Ref extends string, Module extends TModuleProperties> = (
  Ref extends keyof Module ? Infer<Module[Ref], Module> : never
)
// prettier-ignore
export type InferObject<Properties extends Types.TProperties, Module extends TModuleProperties> = { 
  [K in keyof Properties]: Infer<Properties[K], Module> 
} & {}
// prettier-ignore
export type InferConstructor<Parameters extends Types.TSchema[], InstanceType extends Types.TSchema, Module extends TModuleProperties> = Types.Ensure<
  new (...args: InferTuple<Parameters, Module>) => Infer<InstanceType, Module>
>
// prettier-ignore
export type InferFunction<Parameters extends Types.TSchema[], ReturnType extends Types.TSchema, Module extends TModuleProperties> = Types.Ensure<
  (...args: InferTuple<Parameters, Module>) => Infer<ReturnType, Module>
>
// prettier-ignore
export type InferTuple<Types extends Types.TSchema[], Module extends TModuleProperties, Result extends unknown[] = []> = (
  Types extends [infer L extends Types.TSchema, ...infer R extends Types.TSchema[]]
    ? InferTuple<R, Module, [...Result, Infer<L, Module>]>
    : Result
)
// prettier-ignore
export type InferIntersect<Types extends Types.TSchema[], Module extends TModuleProperties, Result extends unknown = unknown> = (
  Types extends [infer L extends Types.TSchema, ...infer R extends Types.TSchema[]]
    ? InferIntersect<R, Module, Result & Infer<L, Module>>
    : Result
)
// prettier-ignore
export type InferUnion<Types extends Types.TSchema[], Module extends TModuleProperties, Result extends unknown = never> = (
  Types extends [infer L extends Types.TSchema, ...infer R extends Types.TSchema[]]
    ? InferUnion<R, Module, Result | Infer<L, Module>>
    : Result
)
// prettier-ignore
export type InferArray<Type extends Types.TSchema, Module extends TModuleProperties> = (
  Types.Ensure<Array<Infer<Type, Module>>>
)
// prettier-ignore
export type InferAsyncIterator<Type extends Types.TSchema, Module extends TModuleProperties> = (
  Types.Ensure<AsyncIterableIterator<Infer<Type, Module>>>
)
// prettier-ignore
export type InferIterator<Type extends Types.TSchema, Module extends TModuleProperties> = (
  Types.Ensure<IterableIterator<Infer<Type, Module>>>
)
// prettier-ignore
type Infer<Type extends Types.TSchema, Module extends TModuleProperties = {}> = (
  Type extends TImport<infer S extends TModuleProperties, infer K extends PropertyKey> ? InferImport<S, K, S> :
  Type extends TModuleRef<infer S extends string> ? InferModuleRef<S, Module> :
  Type extends Types.TObject<infer S extends Types.TProperties> ? InferObject<S, Module> :
  Type extends Types.TConstructor<infer S extends Types.TSchema[], infer R extends Types.TSchema> ? InferConstructor<S, R, Module> :
  Type extends Types.TFunction<infer S extends Types.TSchema[], infer R extends Types.TSchema> ? InferFunction<S, R, Module> :
  Type extends Types.TTuple<infer S extends Types.TSchema[]> ? InferTuple<S, Module> :
  Type extends Types.TIntersect<infer S extends Types.TSchema[]> ? InferIntersect<S, Module> :
  Type extends Types.TUnion<infer S extends Types.TSchema[]> ? InferUnion<S, Module> :
  Type extends Types.TArray<infer S extends Types.TSchema> ? InferArray<S, Module> :
  Type extends Types.TAsyncIterator<infer S extends Types.TSchema> ? InferAsyncIterator<S, Module> :
  Type extends Types.TIterator<infer S extends Types.TSchema> ? InferIterator<S, Module> :
  Type extends Types.TTemplateLiteral<infer S extends Types.TTemplateLiteralKind[]> ? Types.Static<Types.TTemplateLiteral<S>> :
  Type extends Types.TLiteral<infer S extends Types.TLiteralValue> ? S :
  Type extends Types.TAny ? any :
  Type extends Types.TBigInt ? bigint :
  Type extends Types.TBoolean ? boolean :
  Type extends Types.TDate ? Date :
  Type extends Types.TInteger ? number :
  Type extends Types.TNever ? never :
  Type extends Types.TNumber ? number :
  Type extends Types.TRegExp ? string :
  Type extends Types.TString ? string :
  Type extends Types.TSymbol ? symbol :
  Type extends Types.TNull ? null :
  Type extends Types.TUint8Array ? Uint8Array :
  Type extends Types.TUndefined ? undefined :
  Type extends Types.TUnknown ? unknown :
  Type extends Types.TVoid ? void :
  never
)
// ------------------------------------------------------------------
// ModuleRef
// ------------------------------------------------------------------
// prettier-ignore
export interface TModuleRef<Ref extends string> extends Types.TSchema {
  [Types.Kind]: 'ModuleRef'
  $ref: Ref
}
// prettier-ignore
export function ModuleRef<Ref extends string>($ref: Ref): TModuleRef<Ref>  {
  return Types.Type.Ref($ref) as never
}
// ------------------------------------------------------------------
// Import
// ------------------------------------------------------------------
// prettier-ignore
Types.TypeRegistry.Set('Import', (module: TImport, value: unknown) => {
  const keys = Object.getOwnPropertyNames(module.$defs)
  const references = keys.map(key => module.$defs[key as never]) as Types.TSchema[]
  const schema = module.$defs[module.$ref]
  return Check(schema, references, value)
})
// prettier-ignore
export type TModuleProperties = Record<PropertyKey, Types.TSchema>

// prettier-ignore
export interface TImport<Definitions extends TModuleProperties = {}, Key extends keyof Definitions = keyof Definitions> extends Types.TSchema {
  [Types.Kind]: 'Import'
  static: InferImport<Definitions, Key, Definitions>
  $defs: Definitions
  $ref: Key
}
// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
// prettier-ignore
export class ModuleInstance<Properties extends TModuleProperties> {
  constructor(private readonly properties: Properties) {}
  public Import<Key extends keyof Properties>(key: Key): TImport<Properties, Key> {
    const $defs = globalThis.Object.getOwnPropertyNames(this.properties).reduce((Result, Key) => (
     { ...Result, [Key]: { ...this.properties[Key], $id: Key }}
    ), {})
    return { [Types.Kind]: 'Import', $defs, $ref: key } as never
  }
}
export function Module<Properties extends TModuleProperties>(properties: Properties): ModuleInstance<Properties> {
  return new ModuleInstance(properties)
}



