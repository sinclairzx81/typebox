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

// deno-fmt-ignore-file

import * as Schema from '../types/index.ts'
import type { TValidationError } from '../../error/index.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'

// ------------------------------------------------------------------
// HasUnevaluated
// ------------------------------------------------------------------
function HasUnevaluatedFromObject(value: Record<PropertyKey, unknown>): boolean {
  return (
    Schema.IsUnevaluatedItems(value)
    || Schema.IsUnevaluatedProperties(value)
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
// BuildContext
// ------------------------------------------------------------------
export class BuildContext {
  constructor(private readonly hasUnevaluated: boolean) {}
  public UseUnevaluated(): boolean {
    return this.hasUnevaluated
  }
  // ----------------------------------------------------------------
  // Stack
  // ----------------------------------------------------------------
  public Push(): string {
    return E.Call(E.Member('context', 'Push'), [])
  }
  public Pop(): string {
    return E.Call(E.Member('context', 'Pop'), [])
  }
  // ----------------------------------------------------------------
  // Top
  // ----------------------------------------------------------------
  public AddIndex(index: string): string {
    return E.Call(E.Member('context', 'AddIndex'), [index])
  }
  public AddKey(key: string): string {
    return E.Call(E.Member('context', 'AddKey'), [key])
  }
  public Merge(results: string): string {
    return E.Call(E.Member('context', 'Merge'), [results])
  }
}
// ------------------------------------------------------------------
// CheckContext
// ------------------------------------------------------------------
export class CheckContext {
  private readonly stack: {
    indices: Set<number>,
    keys: Set<string>
  }[]
  constructor() {
    const indices = new Set<number>()
    const keys = new Set<string>()
    this.stack = [{ indices, keys }]
  }
  // ----------------------------------------------------------------
  // Stack
  // ----------------------------------------------------------------
  public Push(): true {
    const indices = new Set<number>()
    const keys = new Set<string>()
    this.stack.push({ indices, keys })
    return true
  }
  public Pop(): true {
    this.stack.pop()
    return true
  }
  // ----------------------------------------------------------------
  // Top
  // ----------------------------------------------------------------
  public AddIndex(index: number): true {
    this.GetIndices().add(index)
    return true
  }
  public AddKey(key: string): true {
    this.GetKeys().add(key)
    return true
  }
  public GetIndices(): Set<number> {
    const top = this.stack[this.stack.length - 1]
    return top.indices
  }
  public GetKeys(): Set<string> {
    const top = this.stack[this.stack.length - 1]
    return top.keys
  }
  public Merge(results: CheckContext[]): true {
    for (const context of results) {
      context.GetIndices().forEach(value => this.GetIndices().add(value))
      context.GetKeys().forEach(value => this.GetKeys().add(value))
    }
    return true
  }
}
// ------------------------------------------------------------------
// ErrorContext
// ------------------------------------------------------------------
export type ErrorContextCallback = (error: TValidationError) => unknown
export class ErrorContext extends CheckContext {
  constructor(private readonly callback: ErrorContextCallback) {
    super()
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
  constructor() {
    super(error => this.errors.push(error))
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