/*--------------------------------------------------------------------------

@sinclair/typebox/compiler

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

export namespace Property {
  function DollarSign(char: number) {
    return char === 36
  }
  function Underscore(char: number) {
    return char === 95
  }
  function Numeric(char: number) {
    return char >= 48 && char <= 57
  }
  function Alpha(char: number) {
    return (char >= 65 && char <= 90) || (char >= 97 && char <= 122)
  }
  /** Tests if this property name can be used in a member expression */
  export function Check(propertyName: string) {
    if (propertyName.length === 0) return false
    {
      const code = propertyName.charCodeAt(0)
      if (!(DollarSign(code) || Underscore(code) || Alpha(code))) {
        return false
      }
    }
    for (let i = 1; i < propertyName.length; i++) {
      const code = propertyName.charCodeAt(i)
      if (!(DollarSign(code) || Underscore(code) || Alpha(code) || Numeric(code))) {
        return false
      }
    }
    return true
  }
}
