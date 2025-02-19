/*--------------------------------------------------------------------------

@sinclair/parsebox

The MIT License (MIT)

Copyright (c) 2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import * as Types from './types'
import { Parse } from './parse'

// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
export class Module<Properties extends Types.IModuleProperties = Types.IModuleProperties> {
  constructor(private readonly properties: Properties) {}

  /** Parses using one of the parsers defined on this instance */
  public Parse<Key extends keyof Properties>(key: Key, content: string, context: unknown): [] | [Types.StaticParser<Properties[Key]>, string]
  /** Parses using one of the parsers defined on this instance */
  public Parse<Key extends keyof Properties>(key: Key, content: string): [] | [Types.StaticParser<Properties[Key]>, string]
  /** Parses using one of the parsers defined on this instance */
  public Parse(...args: any[]): never {
    // prettier-ignore
    const [key, content, context] = (
      args.length === 3 ? [args[0], args[1], args[2]] : 
      args.length === 2 ? [args[0], args[1], undefined] : 
      (() => { throw Error('Invalid parse arguments') })()
    )
    return Parse(this.properties, this.properties[key], content, context) as never
  }
}
