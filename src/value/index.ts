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

// ------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------
export * from './assert/index.ts'
export * from './check/index.ts'
export * from './clean/index.ts'
export * from './clone/index.ts'
export * from './codec/index.ts'
export * from './convert/index.ts'
export * from './create/index.ts'
export * from './errors/index.ts'
export * from './default/index.ts'
export * from './equal/index.ts'
export * from './hash/index.ts'
export * from './mutate/index.ts'
export * from './parse/index.ts'
export * from './delta/index.ts'
export * from './pipeline/index.ts'
export * from './pointer/index.ts'
export * from './repair/index.ts'

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
import * as Value from './value.ts'
export * as Value from './value.ts'
export default Value
