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
// Rule30 implemented with TypeBox Script
//
// https://en.wikipedia.org/wiki/Rule_30
//
//                       █                       
//                      ███                      
//                     ██  █                     
//                    ██ ████                    
//                   ██  █   █                   
//                  ██ ████ ███                  
//                 ██  █    █  █                 
//                ██ ████  ██████                
//               ██  █   ███     █               
//              ██ ████ ██  █   ███              
//             ██  █    █ ████ ██  █             
//            ██ ████  ██ █    █ ████            
//           ██  █   ███  ██  ██ █   █           
//          ██ ████ ██  ███ ███  ██ ███          
//         ██  █    █ ███   █  ███  █  █         
//        ██ ████  ██ █  █ █████  ███████        
//       ██  █   ███  ████ █    ███      █       
//      ██ ████ ██  ███    ██  ██  █    ███      
//     ██  █    █ ███  █  ██ ███ ████  ██  █     
//    ██ ████  ██ █  ██████  █   █   ███ ████    
//   ██  █   ███  ████     ████ ███ ██   █   █   
//  ██ ████ ██  ███   █   ██    █   █ █ ███ ███  
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Render
// ------------------------------------------------------------------
function Render(schema: Type.TSchema): string {
  return (schema as any).items.map((item: any) => (item.const === 1 ? '█' : ' ')).join('')
}
// ------------------------------------------------------------------
// Rule30
// ------------------------------------------------------------------
const Module = Type.Script(`
  type Rule30<A extends number, B extends number, C extends number> =
    [A, B, C] extends [1, 1, 1] ? 0 :
    [A, B, C] extends [1, 1, 0] ? 0 :
    [A, B, C] extends [1, 0, 1] ? 0 :
    [A, B, C] extends [1, 0, 0] ? 1 :
    [A, B, C] extends [0, 1, 1] ? 1 :
    [A, B, C] extends [0, 1, 0] ? 1 :
    [A, B, C] extends [0, 0, 1] ? 1 :
    0
  type Step<Input extends number[], T extends number[] = [0, ...Input, 0], Result extends number[] = []> = (
    T extends [infer A, infer B, infer C, ...infer Rest]
      ? Step<Input, [B, C, ...Rest], [...Result, Rule30<A, B, C>]>
      : Result
  )
` as never) as never as Type.TModule<{}>

// ------------------------------------------------------------------
// Machine (Length: 48)
// ------------------------------------------------------------------
export function Run(iteration: number = 128): void {
  let State: Type.TSchema = Type.Script(`[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`)
  console.log(Render(State))
  for (let i = 0; i < iteration; i++) {
    State = Type.Script({ ...Module, State }, 'Step<State>')
    console.log(Render(State))
  }
}