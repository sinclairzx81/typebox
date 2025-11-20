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
// Escape
// ------------------------------------------------------------------
type TEscape0<Index extends string> = Index extends `${infer Left}~0${infer Right}` ? `${Left}~${TEscape<Right>}`
  : Index
type TEscape1<Index extends string> = Index extends `${infer Left}~1${infer Right}` ? `${Left}/${TEscape<Right>}`
  : Index
type TEscape<Index extends string, Escaped0 extends string = TEscape0<Index>, Escaped1 extends string = TEscape1<Escaped0>> = Escaped1
// ------------------------------------------------------------------
// Indices
// ------------------------------------------------------------------
type IndicesReduce<Pointer extends string, Result extends string[] = []> = Pointer extends `${infer Left extends string}/${infer Right extends string}` ? Left extends '' ? IndicesReduce<Right, Result>
  : IndicesReduce<Right, [...Result, TEscape<Left>]>
  : [...Result, TEscape<Pointer>]
type TIndices<
  Pointer extends string,
  Result extends string[] = Pointer extends '' ? []
    : IndicesReduce<Pointer>
> = Result
// ------------------------------------------------------------------
// TResolve
// ------------------------------------------------------------------
type TResolve<Value extends unknown, Indices extends string[]> = Indices extends [infer Left extends string, ...infer Right extends string[]] ? Left extends keyof Value ? TResolve<Value[Left], Right>
  : undefined
  : Value
// ------------------------------------------------------------------
// XPointerGet
// ------------------------------------------------------------------
/** Type Level RFC 6901 Json Pointer Resolver */
export type XPointerGet<Value extends unknown, Pointer extends string, Indices extends string[] = TIndices<Pointer>, Result extends unknown = TResolve<Value, Indices>> = Result
