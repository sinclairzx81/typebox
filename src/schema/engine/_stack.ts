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

import * as S from '../types/index.ts'

export class Collection<T> {
  private readonly values: T[] = []
  public Count(): number {
    return this.values.length
  }
  public First(): T | undefined {
    return this.values.length === 0 ? undefined : this.values[0]
  }
  public Last(): T | undefined {
    return this.values.length === 0 ? undefined : this.values[this.values.length - 1]
  }
  public Push(value: T): void {
    this.values.push(value)
  }
  public Pop(): T | undefined {
    return this.values.pop()
  }
  public ToArray(): T[] {
    return [...this.values]
  }
}
export class Stack {
  public readonly Anchors: Collection<S.XAnchor>
  public readonly Ids: Collection<S.XId>
  public readonly Refs: Collection<S.XRef>
  public readonly RecursiveAnchors: Collection<S.XRecursiveAnchor>
  public readonly DynamicAnchors: Collection<S.XDynamicAnchor>
  constructor(
    protected readonly context: Record<PropertyKey, S.XSchema>,
    protected readonly schema: S.XSchema
  ) {
    this.Anchors = new Collection()
    this.Refs = new Collection()
    this.Ids = new Collection()
    this.RecursiveAnchors = new Collection()
    this.DynamicAnchors = new Collection()
  }
  public GetContext(): Record<PropertyKey, S.XSchema> {
    return this.context
  }
  public GetSchema(): S.XSchema {
    return this.schema
  }
}
