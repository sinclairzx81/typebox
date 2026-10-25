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

import * as BuildInfo from '../buildinfo/index.ts'
import { Banner } from './banner.ts'

/** Creates a CheckContext used for unevaluated validation contexts. */
export const CheckContext = (info: BuildInfo.BuildInfo) => (`${Banner('CheckContext')}
class ${info.NameOfCheckContext} {
  private readonly stack: {
    indices: Set<number>,
    keys: Set<string>
  }[]
  constructor() {
    const indices = new Set<number>()
    const keys = new Set<string>()
    this.stack = [{ indices, keys }]
  }
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
}`)
