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

export interface TMetrics {
  /** The number of times Assign() was called */
  assign: number
  /** The number of times Create() was called */
  create: number
  /** The number of times Clone() was called */
  clone: number
  /** The number of times Discard() was called */
  discard: number
  /** The number of times Update() was called */
  update: number
}

// ------------------------------------------------------------------
// Counters
// ------------------------------------------------------------------
// Metrics exposes these counters as accessors so they remain writable when
// Metrics is frozen. Hosts that share one module graph between isolated
// consumers deep-freeze it, and incrementing a frozen data property throws.
let assign = 0
let create = 0
let clone = 0
let discard = 0
let update = 0

/** TypeBox instantiation metrics */
export const Metrics: TMetrics = {
  get assign() {
    return assign
  },
  set assign(value: number) {
    assign = value
  },
  get create() {
    return create
  },
  set create(value: number) {
    create = value
  },
  get clone() {
    return clone
  },
  set clone(value: number) {
    clone = value
  },
  get discard() {
    return discard
  },
  set discard(value: number) {
    discard = value
  },
  get update() {
    return update
  },
  set update(value: number) {
    update = value
  }
}
