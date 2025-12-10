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

import Type from 'typebox'

// ------------------------------------------------------------------
// Definition
// ------------------------------------------------------------------
export class TUint8Array extends Type.Base<globalThis.Uint8Array> {
  // required: Used by validation
  public override Check(value: unknown): value is Uint8Array {
    return value instanceof Uint8Array
  }
  // required: Used by validation
  public override Errors(value: unknown): object[] {
    return !this.Check(value) ? [{ message: 'not a Uint8Array'}] : []
  }
  // required: Used by type compositor
  public override Clone(): TUint8Array {
    return new TUint8Array()
  }
  // required: Used by value/create
  public override Create(): globalThis.Uint8Array {
    return new globalThis.Uint8Array(0)
  }
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export function Uint8Array(): TUint8Array {
  return new TUint8Array()
}