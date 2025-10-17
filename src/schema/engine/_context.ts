/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-fmt-ignore-file

import * as S from '../types/index.ts'
import type { TValidationError } from '../../error/index.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'

// ------------------------------------------------------------------
// HasUnevaluated
// ------------------------------------------------------------------
function HasUnevaluatedFromObject(value: Record<PropertyKey, unknown>): boolean {
  return (
    S.IsUnevaluatedItems(value)
    || S.IsUnevaluatedProperties(value)
    || G.Keys(value).some(key => HasUnevaluatedFromUnknown(value[key]))
  )
}
function HasUnevaluatedFromArray(value: unknown[]): boolean {
  return value.some(value => HasUnevaluatedFromUnknown(value))
}
function HasUnevaluatedFromUnknown(value: unknown) {
  return (
    G.IsArray(value) ? HasUnevaluatedFromArray(value) :
    G.IsObject(value) ? HasUnevaluatedFromObject(value) :
    false
  )
}
export function HasUnevaluated(context: Record<PropertyKey, unknown>, schema: unknown): boolean {
  return HasUnevaluatedFromUnknown(schema) || G.Keys(context).some(key => HasUnevaluatedFromUnknown(context[key]))
}

// ------------------------------------------------------------------
// BaseContext
// ------------------------------------------------------------------
export class BaseContext {
  constructor(
    protected readonly context: Record<PropertyKey, S.XSchema>,
    protected readonly schema: S.XSchema,
  ) { }
  public GetContext(): Record<PropertyKey, object | boolean> {
    return this.context
  }
  public GetSchema(): object | boolean {
    return this.schema
  }
}
// ------------------------------------------------------------------
// BuildContext
// ------------------------------------------------------------------
export class BuildContext extends BaseContext {
  constructor(context: Record<PropertyKey, S.XSchema>, schema: S.XSchema, private readonly hasUnevaluated: boolean) { 
    super(context, schema)
  }
  public UseUnevaluated(): boolean {
    return this.hasUnevaluated
  }
  public AddIndex(index: string): string {
    return E.Call(E.Member('context', 'AddIndex'), [index])
  }
  public AddKey(key: string): string {
    return E.Call(E.Member('context', 'AddKey'), [key])
  }
  public Clone(): string {
    return E.Call(E.Member('context', 'Clone'), [])
  }
  public Merge(results: string): string {
    return E.Call(E.Member('context', 'Merge'), [results])
  }
}
// ------------------------------------------------------------------
// CheckContext
// ------------------------------------------------------------------
export class CheckContext extends BaseContext {
  private readonly indices: Set<number>
  private readonly keys: Set<string>
  constructor(context: Record<PropertyKey, S.XSchema>, schema: S.XSchema) {
    super(context, schema)
    this.indices = new Set()
    this.keys = new Set()
  }
  public AddIndex(index: number): true {
    this.indices.add(index)
    return true
  }
  public AddKey(key: string): true {
    this.keys.add(key)
    return true
  }
  public GetIndices(): Set<number> {
    return this.indices
  }
  public GetKeys(): Set<string> {
    return this.keys
  }
  public Clone() {
    return new CheckContext(this.context, this.schema)
  }
  public Merge(results: CheckContext[]): true {
    for (const context of results) {
      context.indices.forEach(value => this.indices.add(value))
      context.keys.forEach(value => this.keys.add(value))
    }
    return true
  }
}
// ------------------------------------------------------------------
// ErrorContext
// ------------------------------------------------------------------
export type ErrorContextCallback = (error: TValidationError) => unknown
export class ErrorContext extends CheckContext {
  constructor(context: Record<PropertyKey, S.XSchema>, schema: S.XSchema, private readonly callback: ErrorContextCallback) {
    super(context, schema)
  }
  public AddError(error: TValidationError): false {
    this.callback(error)
    return false
  }
}
// ------------------------------------------------------------------
// AccumulatedErrorContext
// ------------------------------------------------------------------
export class AccumulatedErrorContext extends ErrorContext {
  private readonly errors: TValidationError[]
  constructor(context: Record<PropertyKey, S.XSchema>, schema: S.XSchema) {
    super(context, schema, error => this.errors.push(error))
    this.errors = []
  }
  public override AddError(error: TValidationError): false {
    this.errors.push(error)
    return false
  }
  public GetErrors(): TValidationError[] {
    return this.errors
  }
}