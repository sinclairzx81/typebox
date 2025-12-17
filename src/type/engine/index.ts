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

// ------------------------------------------------------------------
// Engine: Public
// ------------------------------------------------------------------
export { Instantiate, type TInstantiate } from './instantiate.ts'

// ------------------------------------------------------------------
// Engine: Internals
// ------------------------------------------------------------------
export * from './assign/index.ts'
export * from './awaited/index.ts'
export * from './conditional/index.ts'
export * from './constructor-parameters/index.ts'
export * from './cyclic/index.ts'
export * from './enum/index.ts'
export * from './evaluate/index.ts'
export * from './exclude/index.ts'
export * from './extract/index.ts'
export * from './helpers/index.ts'
export * from './indexed/index.ts'
export * from './instance-type/index.ts'
export * from './interface/index.ts'
export * from './intrinsics/index.ts'
export * from './keyof/index.ts'
export * from './mapped/index.ts'
export * from './module/index.ts'
export * from './non-nullable/index.ts'
export * from './object/index.ts'
export * from './omit/index.ts'
export * from './parameters/index.ts'
export * from './patterns/index.ts'
export * from './partial/index.ts'
export * from './pick/index.ts'
export * from './readonly-type/index.ts'
export * from './record/index.ts'
export * from './ref/index.ts'
export * from './required/index.ts'
export * from './return-type/index.ts'
export * from './template-literal/index.ts'
