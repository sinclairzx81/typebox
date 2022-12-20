/*--------------------------------------------------------------------------

@sinclair/typebox/system

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

export class InvalidTypeSystemError extends Error {
  constructor(typeSystem: string) {
    super(`TypeSystemSettings: Unknown TypeSystem '${typeSystem}'`)
  }
}

export type TypeSystemKind = 'json-schema' | 'structural'

class TypeSystemSettings {
  private kind: TypeSystemKind
  constructor() {
    this.kind = 'json-schema'
  }
  /**
   * `Experimental` Sets the type system kind used by TypeBox. By default TypeBox uses `json-schema` assertion
   * rules to verify JavaScript values. If setting the type system to `structural`, TypeBox will use TypeScript
   * structural checking rules enabling Arrays to be validated as Objects.
   */
  public get Kind(): TypeSystemKind {
    return this.kind
  }
  public set Kind(value: TypeSystemKind) {
    if (!(value === 'json-schema' || value === 'structural')) {
      throw new InvalidTypeSystemError(value)
    }
    this.kind = value
  }
}

/** TypeBox TypeSystem Settings */
export const TypeSystem = new TypeSystemSettings()
