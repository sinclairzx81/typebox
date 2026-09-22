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

// deno-lint-ignore-file no-explicit-any

import { Settings } from '../system/settings/index.ts'
import { InstantiationDepthExceeded } from '../system/exceptions/index.ts'

// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
const callbacks = new WeakMap<TRecursive, TRecursive>()
const tailcalls = new WeakSet<TTailCall>()

// ------------------------------------------------------------------
// Future
// ------------------------------------------------------------------
// let globalDepth = 0
// let globalCount = 0
// function IncrementGlobal(): void {
//   globalCount++
//   globalDepth++
// }
// function DecrementGlobal(): void {
//   globalDepth--
//   if (IsEqual(globalDepth, 0)) globalCount = 0
// }
// function AssertGlobal(): void {
//   if (IsLessThan(globalCount, Settings.Get().maxInstantiationDepth)) return
//   InstantiationDepthExceeded()
// }
// ------------------------------------------------------------------
// AssertLocal
// ------------------------------------------------------------------
function AssertLocal(depth: number): void {
  if (depth < Settings.Get().maxInstantiationDepth) return
  InstantiationDepthExceeded()
}
// ------------------------------------------------------------------
// Recursive
// ------------------------------------------------------------------
export type TRecursive = (...args: any[]) => unknown

/** Creates a tail-call enabled recursive function. Recurse via TailCall instead of a normal return to avoid growing the call stack. */
export function Recursive<Recursive extends TRecursive>(callback: Recursive): Recursive {
  const recursive = (...args: Parameters<Recursive>) => {
    let local = 0, tail = callback(...args)
    while (IsTailCall(tail)) AssertLocal(local++), tail = tail.callback(...tail.arguments)
    return tail
  }
  callbacks.set(recursive, callback)
  return recursive as never
}
// ------------------------------------------------------------------
// TailCall
// ------------------------------------------------------------------
interface TTailCall {
  callback: TRecursive
  arguments: unknown[]
}
function IsTailCall(value: unknown): value is TTailCall {
  return tailcalls.has(value as never)
}
/** Requests the next iteration of an enclosing Recursive function, replacing a normal return so the call stack does not grow. */
export function TailCall<Recursive extends TRecursive>(callback: Recursive, ...args: Parameters<Recursive>): ReturnType<Recursive> {
  const tailcall = { callback: callbacks.get(callback) ?? callback, arguments: args }
  tailcalls.add(tailcall)
  return tailcall as never
}
// ------------------------------------------------------------------
// Shift and Accumulators
// ------------------------------------------------------------------
/** Shifts the left-most element from an array and dispatches to the true arm with (left, right), or the false arm if empty. */
export function ShiftLeft<Value, True extends (left: Value, right: Value[]) => unknown, False extends () => unknown>(array: Value[], true_: True, false_: False): ReturnType<True> | ReturnType<False> {
  return ((array.length === 0) ? false_() : true_(array[0], array.slice(1))) as never
}
/** Shifts the right-most element from an array and dispatches to the true arm with (left, right), or the false arm if empty. */
export function ShiftRight<Value, True extends (left: Value[], right: Value) => unknown, False extends () => unknown>(array: Value[], true_: True, false_: False): ReturnType<True> | ReturnType<False> {
  return ((array.length === 0) ? false_() : true_(array.slice(0, array.length - 1), array[array.length - 1])) as never
}
/** Pushes elements onto an array and returns it, typically used to accumulate a result across tail-recursive calls. */
export function Push<Value extends unknown>(values: Value[], ...items: Value[]): Value[] {
  return (values.push(...items), values)
}
