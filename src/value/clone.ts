/*--------------------------------------------------------------------------

@sinclair/typebox/value

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

import { Reflect } from './reflect'

export namespace CloneValue {
  function Undefined(_value: any): any {
    return undefined
  }
  function Null(_value: any): any {
    return null
  }
  function Function(value: any): any {
    return value
  }
  function Object(value: any): any {
    return globalThis.Object.entries(value).reduce((acc, [key, value]) => {
      return { ...acc, [key]: Create(value) }
    }, {})
  }
  function Array(value: any): any {
    return value.map((element: any) => Create(element))
  }
  function BigInt(value: any): any {
    return value
  }
  function Symbol(value: any): any {
    return value
  }
  function String(value: any): any {
    return value
  }
  function Boolean(value: any): any {
    return value
  }
  function Number(value: any): any {
    return value
  }
  export function Create<T extends any>(value: T): T {
    const typeName = Reflect(value)
    switch (typeName) {
      case 'array':
        return Array(value)
      case 'bigint':
        return BigInt(value)
      case 'boolean':
        return Boolean(value)
      case 'function':
        return Function(value)
      case 'null':
        return Null(value)
      case 'number':
        return Number(value)
      case 'object':
        return Object(value)
      case 'string':
        return String(value)
      case 'symbol':
        return Symbol(value)
      case 'undefined':
        return Undefined(value)
      default:
        throw new Error(`Cannot clone from unknown typename ${typeName}`)
    }
  }
}
