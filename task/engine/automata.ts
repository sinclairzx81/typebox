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

import Type from 'typebox'

// ------------------------------------------------------------------
//
// TypeBox: Rule 90 Automata Performance Test
//
// Reference: https://en.wikipedia.org/wiki/Rule_90
//
// ------------------------------------------------------------------
//
// This test computes a 1D cellular automata on a tuple of
// length 64. It is used to test type evaluation performance on a
// known fixed-size item buffer. The test is also used to
// investigate better tail-call optimizations for larger tuple
// sequences. Rule 90 outputs a Sierpinski triangle, shown below.
//
// ------------------------------------------------------------------
//
//                           █
//                          █ █
//                         █   █
//                        █ █ █ █
//                       █       █
//                      █ █     █ █
//                     █   █   █   █
//                    █ █ █ █ █ █ █ █
//                   █               █
//                  █ █             █ █
//                 █   █           █   █
//                █ █ █ █         █ █ █ █
//               █       █       █       █
//              █ █     █ █     █ █     █ █
//             █   █   █   █   █   █   █   █
//            █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █
//           █                               █
//          █ █                             █ █
//         █   █                           █   █
//        █ █ █ █                         █ █ █ █
//       █       █                       █       █
//      █ █     █ █                     █ █     █ █
//     █   █   █   █                   █   █   █   █
//    █ █ █ █ █ █ █ █                 █ █ █ █ █ █ █ █
//
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Render
// ------------------------------------------------------------------
function Render(schema: Type.TSchema): string {
  return (schema as any).items.map((item: any) => (item.const === 1 ? '█' : ' ')).join('')
}
// ------------------------------------------------------------------
// Rule 90
// ------------------------------------------------------------------
const Module = Type.Script(`
  type Rule90<A extends number, B extends number, C extends number> =
    [A, B, C] extends [1, 1, 1] ? 0 :
    [A, B, C] extends [1, 1, 0] ? 1 :
    [A, B, C] extends [1, 0, 1] ? 0 :
    [A, B, C] extends [1, 0, 0] ? 1 :
    [A, B, C] extends [0, 1, 1] ? 1 :
    [A, B, C] extends [0, 1, 0] ? 0 :
    [A, B, C] extends [0, 0, 1] ? 1 :
    0
  type Step<Input extends number[], T extends number[] = [0, ...Input, 0], Result extends number[] = []> = (
    T extends [infer A, infer B, infer C, ...infer Rest]
      ? Step<Input, [B, C, ...Rest], [...Result, Rule90<A, B, C>]>
      : Result
  )
` as never) as never as Type.TModule<{}>
// ------------------------------------------------------------------
// Debug
// ------------------------------------------------------------------
export function Debug(iteration: number = 64): void {
  const half = iteration
  const zeros = Array(half).fill(0).join(', ')
  let State: Type.TSchema = Type.Script(`[${zeros}, 1, ${zeros}]`)
  console.log(Render(State))
  for (let i = 0; i < iteration; i++) {
    State = Type.Script({ ...Module, State }, 'Step<State>')
    console.log(Render(State))
  }
}
