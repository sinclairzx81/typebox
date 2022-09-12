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

export class ValuePointerRootSetError extends Error {
  constructor(public readonly value: unknown, public readonly path: string, public readonly update: unknown) {
    super('ValuePointer: Cannot set root value')
  }
}

export class ValuePointerRootDeleteError extends Error {
  constructor(public readonly value: unknown, public readonly path: string) {
    super('ValuePointer: Cannot delete root value')
  }
}
/** ValuePointer performs mutable operations on values using RFC6901 Json Pointers */
export namespace ValuePointer {
  /** Formats the path into navigable components */
  function* Format(path: string): IterableIterator<string> {
    function clear(chars: string[]) {
      while (chars.length > 0) chars.shift()
    }
    const chars: string[] = []
    for (let i = 0; i < path.length; i++) {
      const char = path.charAt(i)
      if (char === '/') {
        if (i !== 0) {
          yield chars.join('')
          clear(chars)
        }
      } else if (char === '~' && path.charAt(i + 1) === '0' && (path.charAt(i + 2) === '/' || i !== path.length - 1)) {
        chars.push('~')
        i += 1
      } else if (char === '~' && path.charAt(i + 1) === '1' && (path.charAt(i + 2) === '/' || i !== path.length - 1)) {
        chars.push('/')
        i += 1
      } else {
        chars.push(char)
      }
    }
    yield chars.join('')
    clear(chars)
  }

  /** Sets the value at the given pointer. If the value at the pointer does not exist it is created. */
  export function Set(value: unknown, path: string, update: unknown) {
    if (path === '') throw new ValuePointerRootSetError(value, path, update)
    const pointer = [...Format(path)]
    let current: any = value
    while (pointer.length > 1) {
      const next = pointer.shift()!
      if (current[next] === undefined) current[next] = {}
      current = current[next]
    }
    current[pointer.shift()!] = update
  }

  /** Deletes a value at the given path. */
  export function Delete(value: any, path: string) {
    if (path === '') throw new ValuePointerRootDeleteError(value, path)
    let current: any = value
    const pointer = [...Format(path)]
    while (pointer.length > 1) {
      const next = pointer.shift()!
      if (current[next] === undefined) return
      current = current[next]
    }
    if (globalThis.Array.isArray(current)) {
      const index = parseInt(pointer.shift()!)
      return current.splice(index, 1)
    } else {
      const key = pointer.shift()!
      delete current[key]
    }
  }

  /** True if a value exists at the given path */
  export function Has(value: any, path: string) {
    if (path === '') return true
    let current = value
    const pointer = [...Format(path)]
    while (pointer.length > 1) {
      const next = pointer.shift()!
      if (current[next] === undefined) return false
      current = current[next]
    }
    return current[pointer.shift()!] !== undefined
  }

  /** Gets the value at the given path */
  export function Get(value: any, path: string) {
    if (path === '') return value
    let current: any = value
    const pointer = [...Format(path)]
    while (pointer.length > 1) {
      const next = pointer.shift()!
      if (current[next] === undefined) return undefined
      current = current[next]
    }
    return current[pointer.shift()!]
  }
}
