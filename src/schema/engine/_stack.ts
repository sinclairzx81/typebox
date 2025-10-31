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

import * as Schema from '../types/index.ts'
import { Guard as G } from '../../guard/index.ts'
import { Resolver } from '../resolve/index.ts'

export class Stack {
  private readonly ids: Schema.XId[] = []
  private readonly anchors: Schema.XAnchor[] = []
  private readonly recursiveAnchors: Schema.XRecursiveAnchor[] = []
  private readonly dynamicAnchors: Schema.XDynamicAnchor[] = []
  constructor(
    private readonly context: Record<PropertyKey, Schema.XSchema>,
    private readonly schema: Schema.XSchema
  ) {}
  // ----------------------------------------------------------------
  // Base
  // ----------------------------------------------------------------
  public BaseURL(): URL {
    return this.ids.reduce((result, schema) => new URL(schema.$id, result), new URL('root', 'memory://'))
  }
  public Base(): Schema.XSchemaObject {
    return this.ids[this.ids.length - 1] ?? this.schema
  }
  // ----------------------------------------------------------------
  // Stack
  // ----------------------------------------------------------------
  public Push(schema: Schema.XSchema) {
    if (!Schema.IsSchemaObject(schema)) return
    if (Schema.IsId(schema)) this.ids.push(schema)
    if (Schema.IsAnchor(schema)) this.anchors.push(schema)
    if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.push(schema)
    if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.push(schema)
  }
  public Pop(schema: Schema.XSchema) {
    if (!Schema.IsSchemaObject(schema)) return
    if (Schema.IsId(schema)) this.ids.pop()
    if (Schema.IsAnchor(schema)) this.anchors.pop()
    if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.pop()
    if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.pop()
  }
  // ----------------------------------------------------------------
  // Ref
  // ----------------------------------------------------------------
  private FromContext(ref: string): Schema.XSchema | undefined {
    return G.HasPropertyKey(this.context, ref) ? this.context[ref] : undefined
  }
  private FromRef(ref: string): Schema.XSchema | undefined {
    return Resolver.Ref(this.schema, ref)
  }
  public Ref(ref: string): Schema.XSchema | undefined {
    return this.FromContext(ref) ?? this.FromRef(ref)
  }
  // ----------------------------------------------------------------
  // RecursiveRef
  // ----------------------------------------------------------------
  public RecursiveRef(recursiveRef: string): Schema.XSchema | undefined {
    if (Schema.IsRecursiveAnchorTrue(this.Base())) {
      return Resolver.Ref(this.recursiveAnchors[0], recursiveRef)
    }
    return Resolver.Ref(this.Base(), recursiveRef)
  }
  // ----------------------------------------------------------------
  // DynamicRef
  // ----------------------------------------------------------------
  public DynamicRef(dynamicRef: string): Schema.XSchema | undefined {
    return undefined
  }
}
