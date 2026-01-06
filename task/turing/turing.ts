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

// ----------------------------------------------------------------------------
//
// TypeBox: Brainf**k Interpreter Test
//
// Reference: https://en.wikipedia.org/wiki/Brainf**k
//
// ----------------------------------------------------------------------------
//
// This module serves as a Turing complete assertion test. It works by 
// simulating the Brainf**k programming language using only TypeBox 
// type expressions.
//
// Brainf**k is a turing complete esoteric programming language created 
// in 1993 by Swiss programmer Urban Müller. It is deliberately 
// minimalistic, consisting of only eight commands, a data pointer, and 
// an instruction pointer.
//
// ----------------------------------------------------------------------------

// { output: "Hello, World!" }
//
const SourceCode = (
  `>++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.+++++++..+++.>>++++++[<+++++++>-]<+
  +.------------.>++++++[<+++++++++>-]<+.<.+++.------.--------.>>>++++[<++++++++>-
  ]<+.`
)
// ----------------------------------------------------------------------------
// Interpretter
// ----------------------------------------------------------------------------
const Interpretter = Type.Script(`
// ----------------------------------------------------------------------------
// Program
// ----------------------------------------------------------------------------
type Program<Memory, Input, Output, Instruction> = {
  memory: Memory,
  input: Input,
  output: Output,
  instruction: Instruction
}
type ProgramRun<State, Next = ProgramStep<State>> = (
  (Next['instruction'])['next'] extends []
    ? Next
    : ProgramRun<Next>
)
type ProgramStep<State, Instruction = MemoryGet<State['instruction']>> = (
  Instruction extends '>' ? Program<
    MemoryMoveRight<State['memory']>,
    State['input'],
    State['output'],
    MemoryMoveRight<State['instruction']>
  > :
  Instruction extends '<' ? Program<
    MemoryMoveLeft<State['memory']>,
    State['input'],
    State['output'],
    MemoryMoveRight<State['instruction']>
  > :
  Instruction extends '+' ? Program<
    MemoryIncrement<State['memory']>,
    State['input'],
    State['output'],
    MemoryMoveRight<State['instruction']>
  > :
  Instruction extends '-' ? Program<
    MemoryDecrement<State['memory']>,
    State['input'],
    State['output'],
    MemoryMoveRight<State['instruction']>
  > :
  Instruction extends '.' ? Program<
    State['memory'],
    State['input'],
    ListPushRight<State['output'], MemoryGet<State['memory']>>,
    MemoryMoveRight<State['instruction']>
  > :
  Instruction extends ',' ? Program<
    MemorySet<State['memory'], ListGet<State['input']>>,
    ListDropLeft<State['input']>,
    State['output'],
    MemoryMoveRight<State['instruction']>
  > :
  Instruction extends '[' ? (MemoryGet<State['memory']> extends 0 ? 
    Program<
      State['memory'],
      State['input'],
      State['output'],
      MemoryJumpRight<State['instruction']>
    > : Program<
      State['memory'],
      State['input'],
      State['output'],
      MemoryMoveRight<State['instruction']>
    >
  ) :
  Instruction extends ']' ? (MemoryGet<State['memory']> extends 0 ? 
    Program<
      State['memory'],
      State['input'],
      State['output'],
      MemoryMoveRight<State['instruction']>
    > : Program<
      State['memory'],
      State['input'],
      State['output'],
      MemoryJumpLeft<State['instruction']>
    >
  ) : State
)
// ----------------------------------------------------------------------------
// Memory
// ----------------------------------------------------------------------------
interface Memory<Prev extends unknown[], Next extends unknown[]> {
  prev: Prev
  next: Next
}
type MemoryGet<State> = (
  State['next'] extends [infer Left, ...infer Right] ? Left : 0
)
type MemoryIncrement<State> = (
  State['next'] extends [infer Left, ...infer Right]
    ? Memory<State['prev'], [Increment<Left>, ...Right]>
    : State
)
type MemoryDecrement<State> = (
  State['next'] extends [infer Left, ...infer Right]
    ? Memory<State['prev'], [Decrement<Left>, ...Right]>
    : State
)
type MemorySet<State, Value> = (
  State['next'] extends [infer _, ...infer Right] ? 
    Memory<State['prev'], [Value, ...Right]> : 
    State
)
type MemoryJumpRight<State> = (
  State['next'] extends [infer Left, ...infer Right]
    ? Left extends ']'
      ? Memory<[...State['prev'], Left], Right>
      : MemoryJumpRight<Memory<[...State['prev'], Left], Right>>
    : State
)
type MemoryMoveRight<State> = (
  State['next'] extends [infer Left, ...infer Right]
    ? Memory<[...State['prev'], Left], Right>
    : State
)
type MemoryJumpLeft<State> = (
  State['prev'] extends [...infer Left, infer Right]
    ? Right extends '['
      ? Memory<[...Left, Right], State['next']>
      : MemoryJumpLeft<Memory<Left, [Right, ...State['next']]>>
    : State
)
type MemoryMoveLeft<State> = (
  State['prev'] extends [...infer Left, infer Right]
    ? Memory<Left, [Right, ...State['next']]>
    : State
)
// ----------------------------------------------------------------------------
// List
// ----------------------------------------------------------------------------
type List<Items extends unknown[]> = {
  items: Items
}
type ListGet<State> = (
  State['items'] extends [infer Left, ...infer Right] 
    ? Left 
    : 0
)
type ListPushRight<State, Value> = (
  List<[...State['items'], Value]>
)
type ListDropLeft<State> = (
  State['items'] extends [infer Left, ...infer Right]
    ? List<Right>
    : State
)
// ----------------------------------------------------------------------------
// Arithmetic
// ----------------------------------------------------------------------------
type Increment<T extends number> = (
  IncrementMap[T]
)
type IncrementMap = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
  97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128,
  129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160,
  161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192,
  193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224,
  225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 0
]
type Decrement<T extends number> = (
  DecrementMap[T]
)
type DecrementMap = [
  255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
  63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
  95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126,
  127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158,
  159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190,
  191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222,
  223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254
]` as never) as never as Type.TProperties

// --------------------------------------------------------------------------
// Compile
// --------------------------------------------------------------------------
function Compile(input: string): Type.TTuple<Type.TLiteral[]> {
  const literals = (input).replace(/[^\+\-\[\]<>.,]/g, '').split('').map(value => Type.Literal(value))
  return Type.Tuple(literals)
}
// --------------------------------------------------------------------------
// Run
// --------------------------------------------------------------------------
export function Run(): void {
  const program = Type.Script({ ...Interpretter, Code: Compile(SourceCode) }, `ProgramRun<Program<
    Memory<[], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]>, 
    List<[]>, 
    List<[]>, 
    Memory<[], Code>
  >>` as never) as any
  const output = program.properties.output.properties.items.items.map((item: any) => String.fromCharCode(item.const)).join('')
  console.log({ output })
}
// --------------------------------------------------------------------------
// Debug
// --------------------------------------------------------------------------
export function Debug(): void {
  let step = 0
  let program = Type.Script({ ...Interpretter, Code: Compile(SourceCode) }, `Program<
    Memory<[], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]>, 
    List<[]>, 
    List<[]>, 
    Memory<[], Code>
  >` as never) as any
  while (true) {
    console.clear()
    const input = program.properties.input.properties.items.items.map((type: Type.TLiteral) => type.const).join(' ')
    const output = program.properties.output.properties.items.items.map((type: Type.TLiteral) => type.const).join(' ')
    const memory_prev = program.properties.memory.properties.prev.items.map((type: Type.TLiteral) => type.const)
    const memory_next = program.properties.memory.properties.next.items.map((type: Type.TLiteral) => type.const)
    const memory = [...memory_prev, ...memory_next].join(' ')
    const current = program.properties.instruction.properties.next.items[0]
    const next = program.properties.instruction.properties.next.items.map((type: Type.TLiteral) => type.const).join(' ')
    const prev = program.properties.instruction.properties.prev.items.map((type: Type.TLiteral) => type.const).join(' ')
    console.log('Program', { step, input, output, memory, current, next, prev })
    if(program.properties.instruction.properties.next.items.length === 0) break
    program = Type.Script({ ...Interpretter, State: program }, `ProgramStep<State>`)
    step += 1
  }
  const output = program.properties.output.properties.items.items.map((type: Type.TLiteral<number>) => String.fromCharCode(type.const)).join('')
  console.log({ output })
}