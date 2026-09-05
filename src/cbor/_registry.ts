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

// ------------------------------------------------------------------
// Codec
// ------------------------------------------------------------------
/** Defines how a value of type T is encoded to and decoded from CBOR via a tag number. */
export interface Codec<Value = unknown> {
  /** The IANA-registered or user-defined CBOR tag number identifying this codec. */
  tag: number
  /** Converts a value of type T into a CBOR-serializable payload. */
  Encode(value: Value): any
  /** Reconstructs a value of type T from a decoded CBOR payload. */
  Decode(data: any): Value
}
// ------------------------------------------------------------------
// Registry
// ------------------------------------------------------------------
const byConstructor = new Map<new (...args: never[]) => unknown, Codec>()
const byTag = new Map<number, Codec>()

// ------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------
type TCodecConstructor = new (...args: never[]) => unknown

/** Resets the codec registry. */
export function Reset(): void {
  byConstructor.clear()
  byTag.clear()
}
/** Registers a codec for the given constructor, keyed by constructor for encoding and by tag for decoding. */
export function SetCodec<Constructor extends TCodecConstructor>(
  constructor: Constructor,
  codec: Codec<InstanceType<Constructor>>
): void {
  byConstructor.set(constructor, codec)
  byTag.set(codec.tag, codec)
}
/** Returns the codec registered for the given tag number, or undefined if none is found. */
export function GetCodecByTag(tag: number): Codec | undefined {
  return byTag.get(tag)
}
/** Returns the codec associated with a value's constructor, or undefined if none is found. */
export function GetCodecByConstructor(value: unknown): Codec | undefined {
  if (value === null || value === undefined) return undefined
  return byConstructor.get((value as object).constructor as never)
}
