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
import { Guard as G } from '../../guard/index.ts'
import { Resolve } from '../resolve/index.ts'

export class Stack {
  private readonly ids: Schema.XId[] = []
  private readonly anchors: Schema.XAnchor[] = []
  private readonly recursiveAnchors: Schema.XRecursiveAnchor[] = []
  private readonly dynamicAnchors: Schema.XDynamicAnchor[] = []
  constructor(
    private readonly context: Record<PropertyKey, Schema.XSchema>,
    private readonly schema: Schema.XSchema
  ) { }
  // ----------------------------------------------------------------
  // Base
  // ----------------------------------------------------------------
  public BaseURL(): URL {
    return this.ids.reduce((result, schema) => new URL(schema.$id, result), new URL('http://unknown'))
  }
  public Base(): Schema.XSchemaObject {
    return this.ids[this.ids.length - 1] ?? this.schema
  }
  // ----------------------------------------------------------------
  // Stack
  // ----------------------------------------------------------------
  public Push(schema: Schema.XSchema) {
    if (!Schema.IsSchemaObject(schema)) return
    if (Schema.IsId(schema)) { this.ids.push(schema); this.#PushResourceAnchors(schema); }
    if (Schema.IsAnchor(schema)) this.anchors.push(schema)
    if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.push(schema)
    if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.push(schema)
  }
  public Pop(schema: Schema.XSchema) {
    if (!Schema.IsSchemaObject(schema)) return
    if (Schema.IsId(schema)) { this.ids.pop(); this.#PopResourceAnchors(schema); }
    if (Schema.IsAnchor(schema)) this.anchors.pop()
    if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.pop()
    if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.pop()
  }
  // ----------------------------------------------------------------
  // Stack: ResourceAnchors
  //
  // We push dynamicAnchors that are down of the current base such
  // that DynamicRef can resolve them. We push only as far as the
  // current scope.
  // ----------------------------------------------------------------
  #PushResourceAnchors(schema: Schema.XSchema, isRoot: boolean = true): void {
    if (!Schema.IsSchemaObject(schema)) return
    const current = schema as Record<PropertyKey, Schema.XSchema>
    if (!isRoot && Schema.IsId(current)) return
    if (!isRoot && Schema.IsDynamicAnchor(current)) this.dynamicAnchors.push(current)
    for (const key of G.Keys(current)) this.#PushResourceAnchors(current[key], false)
  }
  #PopResourceAnchors(schema: Schema.XSchema, isRoot: boolean = true): void {
    if (!Schema.IsSchemaObject(schema)) return
    const current = schema as Record<PropertyKey, Schema.XSchema>
    if (!isRoot && Schema.IsId(current)) return
    if (!isRoot && Schema.IsDynamicAnchor(current)) this.dynamicAnchors.pop()
    for (const key of G.Keys(current)) this.#PopResourceAnchors(current[key], false)
  }
  // ----------------------------------------------------------------
  // Ref
  // ----------------------------------------------------------------
  #FromContext(ref: Schema.XRef): Schema.XSchema | undefined {
    return G.HasPropertyKey(this.context, ref.$ref) ? this.context[ref.$ref] : undefined
  }
  #FromRef(ref: Schema.XRef): Schema.XSchema | undefined {
    const root = this.schema as Schema.XSchemaObject
    return !ref.$ref.startsWith('#')
      ? Resolve.Ref(root, ref.$ref)
      : Resolve.Ref(this.Base(), ref.$ref)
  }
  public Ref(ref: Schema.XRef): Schema.XSchema | undefined {
    return this.#FromContext(ref) ?? this.#FromRef(ref)
  }
  // ----------------------------------------------------------------
  // RecursiveRef
  // ----------------------------------------------------------------
  public RecursiveRef(recursiveRef: Schema.XRecursiveRef): Schema.XSchema | undefined {
    return Schema.IsRecursiveAnchorTrue(this.Base())
      ? Resolve.Ref(this.recursiveAnchors[0], recursiveRef.$recursiveRef)
      : Resolve.Ref(this.Base(), recursiveRef.$recursiveRef)
  }
  // ----------------------------------------------------------------
  // DynamicRef
  // ----------------------------------------------------------------
  public DynamicRef(dynamicRef: Schema.XDynamicRef): Schema.XSchema | undefined {
    const root = this.schema as Schema.XSchemaObject
    return Resolve.DynamicRef(root, this.Base(), dynamicRef, this.dynamicAnchors)
  }
}
