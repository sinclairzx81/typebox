/*--------------------------------------------------------------------------

@sinclair/typebox/custom

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

export type CustomValidationFunction<TSchema> = (schema: TSchema, value: unknown) => boolean

/** Provides functions to create user defined types */
export namespace Custom {
  const customs = new Map<string, CustomValidationFunction<any>>()

  /** Clears all user defined types */
  export function Clear() {
    return customs.clear()
  }

  /** Returns true if this user defined type exists */
  export function Has(kind: string) {
    return customs.has(kind)
  }

  /** Sets a validation function for a user defined type */
  export function Set<TSchema = unknown>(kind: string, func: CustomValidationFunction<TSchema>) {
    customs.set(kind, func)
  }

  /** Gets a custom validation function for a user defined type */
  export function Get(kind: string) {
    return customs.get(kind)
  }
}
