/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { JsonTypeBuilder } from './json'
import { AsyncIterator, type TAsyncIterator } from '../async-iterator/index'
import { Awaited, type TAwaited } from '../awaited/index'
import { BigInt, type TBigInt, type BigIntOptions } from '../bigint/index'
import { Constructor, type TConstructor } from '../constructor/index'
import { ConstructorParameters, type TConstructorParameters } from '../constructor-parameters/index'
import { Date, type TDate, type DateOptions } from '../date/index'
import { Function as FunctionType, type TFunction } from '../function/index'
import { InstanceType, type TInstanceType } from '../instance-type/index'
import { Iterator, type TIterator } from '../iterator/index'
import { Parameters, type TParameters } from '../parameters/index'
import { Promise, type TPromise } from '../promise/index'
import { RegExp, type TRegExp } from '../regexp/index'
import { ReturnType, type TReturnType } from '../return-type/index'
import { type TSchema, type SchemaOptions } from '../schema/index'
import { Symbol, type TSymbol } from '../symbol/index'
import { Uint8Array, type TUint8Array, type Uint8ArrayOptions } from '../uint8array/index'
import { Undefined, type TUndefined } from '../undefined/index'
import { Void, type TVoid } from '../void/index'

/** JavaScript Type Builder with Static Resolution for TypeScript */
export class JavaScriptTypeBuilder extends JsonTypeBuilder {
  /** `[JavaScript]` Creates a AsyncIterator type */
  public AsyncIterator<T extends TSchema>(items: T, options: SchemaOptions = {}): TAsyncIterator<T> {
    return AsyncIterator(items, options)
  }
  /** `[JavaScript]` Constructs a type by recursively unwrapping Promise types */
  public Awaited<T extends TSchema>(schema: T, options: SchemaOptions = {}): TAwaited<T> {
    return Awaited(schema, options)
  }
  /** `[JavaScript]` Creates a BigInt type */
  public BigInt(options: BigIntOptions = {}): TBigInt {
    return BigInt(options)
  }
  /** `[JavaScript]` Extracts the ConstructorParameters from the given Constructor type */
  public ConstructorParameters<T extends TConstructor<TSchema[], TSchema>>(schema: T, options: SchemaOptions = {}): TConstructorParameters<T> {
    return ConstructorParameters(schema, options)
  }
  /** `[JavaScript]` Creates a Constructor type */
  public Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U> {
    return Constructor(parameters, returns, options)
  }
  /** `[JavaScript]` Creates a Date type */
  public Date(options: DateOptions = {}): TDate {
    return Date(options)
  }
  /** `[JavaScript]` Creates a Function type */
  public Function<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TFunction<T, U> {
    return FunctionType(parameters, returns, options)
  }
  /** `[JavaScript]` Extracts the InstanceType from the given Constructor type */
  public InstanceType<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TInstanceType<T> {
    return InstanceType(schema, options)
  }
  /** `[JavaScript]` Creates an Iterator type */
  public Iterator<T extends TSchema>(items: T, options: SchemaOptions = {}): TIterator<T> {
    return Iterator(items, options)
  }
  /** `[JavaScript]` Extracts the Parameters from the given Function type */
  public Parameters<T extends TFunction<TSchema[], TSchema>>(schema: T, options: SchemaOptions = {}): TParameters<T> {
    return Parameters(schema, options)
  }
  /** `[JavaScript]` Creates a Promise type */
  public Promise<T extends TSchema>(item: T, options: SchemaOptions = {}): TPromise<T> {
    return Promise(item, options)
  }
  /** `[JavaScript]` Creates a RegExp type */
  public RegExp(pattern: string, options?: SchemaOptions): TRegExp
  /** `[JavaScript]` Creates a RegExp type */
  public RegExp(regex: RegExp, options?: SchemaOptions): TRegExp
  /** `[JavaScript]` Creates a RegExp type */
  public RegExp(unresolved: string | RegExp, options: SchemaOptions = {}) {
    return RegExp(unresolved as any, options)
  }
  /** `[JavaScript]` Extracts the ReturnType from the given Function type */
  public ReturnType<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TReturnType<T> {
    return ReturnType(schema, options)
  }
  /** `[JavaScript]` Creates a Symbol type */
  public Symbol(options?: SchemaOptions): TSymbol {
    return Symbol(options)
  }
  /** `[JavaScript]` Creates a Undefined type */
  public Undefined(options: SchemaOptions = {}): TUndefined {
    return Undefined(options)
  }
  /** `[JavaScript]` Creates a Uint8Array type */
  public Uint8Array(options: Uint8ArrayOptions = {}): TUint8Array {
    return Uint8Array(options)
  }
  /** `[JavaScript]` Creates a Void type */
  public Void(options: SchemaOptions = {}): TVoid {
    return Void(options)
  }
}
