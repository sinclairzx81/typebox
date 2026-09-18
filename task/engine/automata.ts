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
// TypeBox: Cellular Automata Performance Test
//
// Reference: https://en.wikipedia.org/wiki/Rule_30
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Render
// ------------------------------------------------------------------
function Render(schema: Type.TSchema): string {
  return (schema as any).items.map((item: any) => (item.const === 1 ? '█' : ' ')).join('')
}
// ------------------------------------------------------------------
// Program
// ------------------------------------------------------------------
const Program = Type.Script(`
  type Next<Rule extends number[], A extends number, B extends number, C extends number> = (
    [A, B, C] extends [1, 1, 1] ? Rule[0] :
    [A, B, C] extends [1, 1, 0] ? Rule[1] :
    [A, B, C] extends [1, 0, 1] ? Rule[2] :
    [A, B, C] extends [1, 0, 0] ? Rule[3] :
    [A, B, C] extends [0, 1, 1] ? Rule[4] :
    [A, B, C] extends [0, 1, 0] ? Rule[5] :
    [A, B, C] extends [0, 0, 1] ? Rule[6] :
    Rule[7]
  )
  type Advance<State extends number[], Rule extends number[], Row extends number[] = [0, ...State, 0], Result extends number[] = []> = (
    Row extends [infer A, infer B, infer C, ...infer Rest]
      ? Advance<State, Rule, [B, C, ...Rest], [...Result, Next<Rule, A, B, C>]>
      : Result
  )
` as never) as never as Type.TModule<{}>
// ------------------------------------------------------------------
// Debug
// ------------------------------------------------------------------
export function Debug(rule: number = 30, steps: number = 40): void {
  const half = steps
  const zeros = Array(half).fill(0).join(', ')
  let State: Type.TSchema = Type.Script(`[${zeros}, 1, ${zeros}]`)
  console.log(Render(State))
  for (let i = 0; i < steps; i++) {
    State = Type.Script({ ...Program, State, Rule: Rules[rule] }, 'Advance<State, Rule>')
    console.log(Render(State))
  }
}
// ------------------------------------------------------------------
// Rules
// ------------------------------------------------------------------
const Rules = [
  Type.Script(`[0, 0, 0, 0, 0, 0, 0, 0]`), // Rule 0
  Type.Script(`[0, 0, 0, 0, 0, 0, 0, 1]`), // Rule 1
  Type.Script(`[0, 0, 0, 0, 0, 0, 1, 0]`), // Rule 2
  Type.Script(`[0, 0, 0, 0, 0, 0, 1, 1]`), // Rule 3
  Type.Script(`[0, 0, 0, 0, 0, 1, 0, 0]`), // Rule 4
  Type.Script(`[0, 0, 0, 0, 0, 1, 0, 1]`), // Rule 5
  Type.Script(`[0, 0, 0, 0, 0, 1, 1, 0]`), // Rule 6
  Type.Script(`[0, 0, 0, 0, 0, 1, 1, 1]`), // Rule 7
  Type.Script(`[0, 0, 0, 0, 1, 0, 0, 0]`), // Rule 8
  Type.Script(`[0, 0, 0, 0, 1, 0, 0, 1]`), // Rule 9
  Type.Script(`[0, 0, 0, 0, 1, 0, 1, 0]`), // Rule 10
  Type.Script(`[0, 0, 0, 0, 1, 0, 1, 1]`), // Rule 11
  Type.Script(`[0, 0, 0, 0, 1, 1, 0, 0]`), // Rule 12
  Type.Script(`[0, 0, 0, 0, 1, 1, 0, 1]`), // Rule 13
  Type.Script(`[0, 0, 0, 0, 1, 1, 1, 0]`), // Rule 14
  Type.Script(`[0, 0, 0, 0, 1, 1, 1, 1]`), // Rule 15
  Type.Script(`[0, 0, 0, 1, 0, 0, 0, 0]`), // Rule 16
  Type.Script(`[0, 0, 0, 1, 0, 0, 0, 1]`), // Rule 17
  Type.Script(`[0, 0, 0, 1, 0, 0, 1, 0]`), // Rule 18
  Type.Script(`[0, 0, 0, 1, 0, 0, 1, 1]`), // Rule 19
  Type.Script(`[0, 0, 0, 1, 0, 1, 0, 0]`), // Rule 20
  Type.Script(`[0, 0, 0, 1, 0, 1, 0, 1]`), // Rule 21
  Type.Script(`[0, 0, 0, 1, 0, 1, 1, 0]`), // Rule 22
  Type.Script(`[0, 0, 0, 1, 0, 1, 1, 1]`), // Rule 23
  Type.Script(`[0, 0, 0, 1, 1, 0, 0, 0]`), // Rule 24
  Type.Script(`[0, 0, 0, 1, 1, 0, 0, 1]`), // Rule 25
  Type.Script(`[0, 0, 0, 1, 1, 0, 1, 0]`), // Rule 26
  Type.Script(`[0, 0, 0, 1, 1, 0, 1, 1]`), // Rule 27
  Type.Script(`[0, 0, 0, 1, 1, 1, 0, 0]`), // Rule 28
  Type.Script(`[0, 0, 0, 1, 1, 1, 0, 1]`), // Rule 29
  Type.Script(`[0, 0, 0, 1, 1, 1, 1, 0]`), // Rule 30
  Type.Script(`[0, 0, 0, 1, 1, 1, 1, 1]`), // Rule 31
  Type.Script(`[0, 0, 1, 0, 0, 0, 0, 0]`), // Rule 32
  Type.Script(`[0, 0, 1, 0, 0, 0, 0, 1]`), // Rule 33
  Type.Script(`[0, 0, 1, 0, 0, 0, 1, 0]`), // Rule 34
  Type.Script(`[0, 0, 1, 0, 0, 0, 1, 1]`), // Rule 35
  Type.Script(`[0, 0, 1, 0, 0, 1, 0, 0]`), // Rule 36
  Type.Script(`[0, 0, 1, 0, 0, 1, 0, 1]`), // Rule 37
  Type.Script(`[0, 0, 1, 0, 0, 1, 1, 0]`), // Rule 38
  Type.Script(`[0, 0, 1, 0, 0, 1, 1, 1]`), // Rule 39
  Type.Script(`[0, 0, 1, 0, 1, 0, 0, 0]`), // Rule 40
  Type.Script(`[0, 0, 1, 0, 1, 0, 0, 1]`), // Rule 41
  Type.Script(`[0, 0, 1, 0, 1, 0, 1, 0]`), // Rule 42
  Type.Script(`[0, 0, 1, 0, 1, 0, 1, 1]`), // Rule 43
  Type.Script(`[0, 0, 1, 0, 1, 1, 0, 0]`), // Rule 44
  Type.Script(`[0, 0, 1, 0, 1, 1, 0, 1]`), // Rule 45
  Type.Script(`[0, 0, 1, 0, 1, 1, 1, 0]`), // Rule 46
  Type.Script(`[0, 0, 1, 0, 1, 1, 1, 1]`), // Rule 47
  Type.Script(`[0, 0, 1, 1, 0, 0, 0, 0]`), // Rule 48
  Type.Script(`[0, 0, 1, 1, 0, 0, 0, 1]`), // Rule 49
  Type.Script(`[0, 0, 1, 1, 0, 0, 1, 0]`), // Rule 50
  Type.Script(`[0, 0, 1, 1, 0, 0, 1, 1]`), // Rule 51
  Type.Script(`[0, 0, 1, 1, 0, 1, 0, 0]`), // Rule 52
  Type.Script(`[0, 0, 1, 1, 0, 1, 0, 1]`), // Rule 53
  Type.Script(`[0, 0, 1, 1, 0, 1, 1, 0]`), // Rule 54
  Type.Script(`[0, 0, 1, 1, 0, 1, 1, 1]`), // Rule 55
  Type.Script(`[0, 0, 1, 1, 1, 0, 0, 0]`), // Rule 56
  Type.Script(`[0, 0, 1, 1, 1, 0, 0, 1]`), // Rule 57
  Type.Script(`[0, 0, 1, 1, 1, 0, 1, 0]`), // Rule 58
  Type.Script(`[0, 0, 1, 1, 1, 0, 1, 1]`), // Rule 59
  Type.Script(`[0, 0, 1, 1, 1, 1, 0, 0]`), // Rule 60
  Type.Script(`[0, 0, 1, 1, 1, 1, 0, 1]`), // Rule 61
  Type.Script(`[0, 0, 1, 1, 1, 1, 1, 0]`), // Rule 62
  Type.Script(`[0, 0, 1, 1, 1, 1, 1, 1]`), // Rule 63
  Type.Script(`[0, 1, 0, 0, 0, 0, 0, 0]`), // Rule 64
  Type.Script(`[0, 1, 0, 0, 0, 0, 0, 1]`), // Rule 65
  Type.Script(`[0, 1, 0, 0, 0, 0, 1, 0]`), // Rule 66
  Type.Script(`[0, 1, 0, 0, 0, 0, 1, 1]`), // Rule 67
  Type.Script(`[0, 1, 0, 0, 0, 1, 0, 0]`), // Rule 68
  Type.Script(`[0, 1, 0, 0, 0, 1, 0, 1]`), // Rule 69
  Type.Script(`[0, 1, 0, 0, 0, 1, 1, 0]`), // Rule 70
  Type.Script(`[0, 1, 0, 0, 0, 1, 1, 1]`), // Rule 71
  Type.Script(`[0, 1, 0, 0, 1, 0, 0, 0]`), // Rule 72
  Type.Script(`[0, 1, 0, 0, 1, 0, 0, 1]`), // Rule 73
  Type.Script(`[0, 1, 0, 0, 1, 0, 1, 0]`), // Rule 74
  Type.Script(`[0, 1, 0, 0, 1, 0, 1, 1]`), // Rule 75
  Type.Script(`[0, 1, 0, 0, 1, 1, 0, 0]`), // Rule 76
  Type.Script(`[0, 1, 0, 0, 1, 1, 0, 1]`), // Rule 77
  Type.Script(`[0, 1, 0, 0, 1, 1, 1, 0]`), // Rule 78
  Type.Script(`[0, 1, 0, 0, 1, 1, 1, 1]`), // Rule 79
  Type.Script(`[0, 1, 0, 1, 0, 0, 0, 0]`), // Rule 80
  Type.Script(`[0, 1, 0, 1, 0, 0, 0, 1]`), // Rule 81
  Type.Script(`[0, 1, 0, 1, 0, 0, 1, 0]`), // Rule 82
  Type.Script(`[0, 1, 0, 1, 0, 0, 1, 1]`), // Rule 83
  Type.Script(`[0, 1, 0, 1, 0, 1, 0, 0]`), // Rule 84
  Type.Script(`[0, 1, 0, 1, 0, 1, 0, 1]`), // Rule 85
  Type.Script(`[0, 1, 0, 1, 0, 1, 1, 0]`), // Rule 86
  Type.Script(`[0, 1, 0, 1, 0, 1, 1, 1]`), // Rule 87
  Type.Script(`[0, 1, 0, 1, 1, 0, 0, 0]`), // Rule 88
  Type.Script(`[0, 1, 0, 1, 1, 0, 0, 1]`), // Rule 89
  Type.Script(`[0, 1, 0, 1, 1, 0, 1, 0]`), // Rule 90
  Type.Script(`[0, 1, 0, 1, 1, 0, 1, 1]`), // Rule 91
  Type.Script(`[0, 1, 0, 1, 1, 1, 0, 0]`), // Rule 92
  Type.Script(`[0, 1, 0, 1, 1, 1, 0, 1]`), // Rule 93
  Type.Script(`[0, 1, 0, 1, 1, 1, 1, 0]`), // Rule 94
  Type.Script(`[0, 1, 0, 1, 1, 1, 1, 1]`), // Rule 95
  Type.Script(`[0, 1, 1, 0, 0, 0, 0, 0]`), // Rule 96
  Type.Script(`[0, 1, 1, 0, 0, 0, 0, 1]`), // Rule 97
  Type.Script(`[0, 1, 1, 0, 0, 0, 1, 0]`), // Rule 98
  Type.Script(`[0, 1, 1, 0, 0, 0, 1, 1]`), // Rule 99
  Type.Script(`[0, 1, 1, 0, 0, 1, 0, 0]`), // Rule 100
  Type.Script(`[0, 1, 1, 0, 0, 1, 0, 1]`), // Rule 101
  Type.Script(`[0, 1, 1, 0, 0, 1, 1, 0]`), // Rule 102
  Type.Script(`[0, 1, 1, 0, 0, 1, 1, 1]`), // Rule 103
  Type.Script(`[0, 1, 1, 0, 1, 0, 0, 0]`), // Rule 104
  Type.Script(`[0, 1, 1, 0, 1, 0, 0, 1]`), // Rule 105
  Type.Script(`[0, 1, 1, 0, 1, 0, 1, 0]`), // Rule 106
  Type.Script(`[0, 1, 1, 0, 1, 0, 1, 1]`), // Rule 107
  Type.Script(`[0, 1, 1, 0, 1, 1, 0, 0]`), // Rule 108
  Type.Script(`[0, 1, 1, 0, 1, 1, 0, 1]`), // Rule 109
  Type.Script(`[0, 1, 1, 0, 1, 1, 1, 0]`), // Rule 110
  Type.Script(`[0, 1, 1, 0, 1, 1, 1, 1]`), // Rule 111
  Type.Script(`[0, 1, 1, 1, 0, 0, 0, 0]`), // Rule 112
  Type.Script(`[0, 1, 1, 1, 0, 0, 0, 1]`), // Rule 113
  Type.Script(`[0, 1, 1, 1, 0, 0, 1, 0]`), // Rule 114
  Type.Script(`[0, 1, 1, 1, 0, 0, 1, 1]`), // Rule 115
  Type.Script(`[0, 1, 1, 1, 0, 1, 0, 0]`), // Rule 116
  Type.Script(`[0, 1, 1, 1, 0, 1, 0, 1]`), // Rule 117
  Type.Script(`[0, 1, 1, 1, 0, 1, 1, 0]`), // Rule 118
  Type.Script(`[0, 1, 1, 1, 0, 1, 1, 1]`), // Rule 119
  Type.Script(`[0, 1, 1, 1, 1, 0, 0, 0]`), // Rule 120
  Type.Script(`[0, 1, 1, 1, 1, 0, 0, 1]`), // Rule 121
  Type.Script(`[0, 1, 1, 1, 1, 0, 1, 0]`), // Rule 122
  Type.Script(`[0, 1, 1, 1, 1, 0, 1, 1]`), // Rule 123
  Type.Script(`[0, 1, 1, 1, 1, 1, 0, 0]`), // Rule 124
  Type.Script(`[0, 1, 1, 1, 1, 1, 0, 1]`), // Rule 125
  Type.Script(`[0, 1, 1, 1, 1, 1, 1, 0]`), // Rule 126
  Type.Script(`[0, 1, 1, 1, 1, 1, 1, 1]`), // Rule 127
  Type.Script(`[1, 0, 0, 0, 0, 0, 0, 0]`), // Rule 128
  Type.Script(`[1, 0, 0, 0, 0, 0, 0, 1]`), // Rule 129
  Type.Script(`[1, 0, 0, 0, 0, 0, 1, 0]`), // Rule 130
  Type.Script(`[1, 0, 0, 0, 0, 0, 1, 1]`), // Rule 131
  Type.Script(`[1, 0, 0, 0, 0, 1, 0, 0]`), // Rule 132
  Type.Script(`[1, 0, 0, 0, 0, 1, 0, 1]`), // Rule 133
  Type.Script(`[1, 0, 0, 0, 0, 1, 1, 0]`), // Rule 134
  Type.Script(`[1, 0, 0, 0, 0, 1, 1, 1]`), // Rule 135
  Type.Script(`[1, 0, 0, 0, 1, 0, 0, 0]`), // Rule 136
  Type.Script(`[1, 0, 0, 0, 1, 0, 0, 1]`), // Rule 137
  Type.Script(`[1, 0, 0, 0, 1, 0, 1, 0]`), // Rule 138
  Type.Script(`[1, 0, 0, 0, 1, 0, 1, 1]`), // Rule 139
  Type.Script(`[1, 0, 0, 0, 1, 1, 0, 0]`), // Rule 140
  Type.Script(`[1, 0, 0, 0, 1, 1, 0, 1]`), // Rule 141
  Type.Script(`[1, 0, 0, 0, 1, 1, 1, 0]`), // Rule 142
  Type.Script(`[1, 0, 0, 0, 1, 1, 1, 1]`), // Rule 143
  Type.Script(`[1, 0, 0, 1, 0, 0, 0, 0]`), // Rule 144
  Type.Script(`[1, 0, 0, 1, 0, 0, 0, 1]`), // Rule 145
  Type.Script(`[1, 0, 0, 1, 0, 0, 1, 0]`), // Rule 146
  Type.Script(`[1, 0, 0, 1, 0, 0, 1, 1]`), // Rule 147
  Type.Script(`[1, 0, 0, 1, 0, 1, 0, 0]`), // Rule 148
  Type.Script(`[1, 0, 0, 1, 0, 1, 0, 1]`), // Rule 149
  Type.Script(`[1, 0, 0, 1, 0, 1, 1, 0]`), // Rule 150
  Type.Script(`[1, 0, 0, 1, 0, 1, 1, 1]`), // Rule 151
  Type.Script(`[1, 0, 0, 1, 1, 0, 0, 0]`), // Rule 152
  Type.Script(`[1, 0, 0, 1, 1, 0, 0, 1]`), // Rule 153
  Type.Script(`[1, 0, 0, 1, 1, 0, 1, 0]`), // Rule 154
  Type.Script(`[1, 0, 0, 1, 1, 0, 1, 1]`), // Rule 155
  Type.Script(`[1, 0, 0, 1, 1, 1, 0, 0]`), // Rule 156
  Type.Script(`[1, 0, 0, 1, 1, 1, 0, 1]`), // Rule 157
  Type.Script(`[1, 0, 0, 1, 1, 1, 1, 0]`), // Rule 158
  Type.Script(`[1, 0, 0, 1, 1, 1, 1, 1]`), // Rule 159
  Type.Script(`[1, 0, 1, 0, 0, 0, 0, 0]`), // Rule 160
  Type.Script(`[1, 0, 1, 0, 0, 0, 0, 1]`), // Rule 161
  Type.Script(`[1, 0, 1, 0, 0, 0, 1, 0]`), // Rule 162
  Type.Script(`[1, 0, 1, 0, 0, 0, 1, 1]`), // Rule 163
  Type.Script(`[1, 0, 1, 0, 0, 1, 0, 0]`), // Rule 164
  Type.Script(`[1, 0, 1, 0, 0, 1, 0, 1]`), // Rule 165
  Type.Script(`[1, 0, 1, 0, 0, 1, 1, 0]`), // Rule 166
  Type.Script(`[1, 0, 1, 0, 0, 1, 1, 1]`), // Rule 167
  Type.Script(`[1, 0, 1, 0, 1, 0, 0, 0]`), // Rule 168
  Type.Script(`[1, 0, 1, 0, 1, 0, 0, 1]`), // Rule 169
  Type.Script(`[1, 0, 1, 0, 1, 0, 1, 0]`), // Rule 170
  Type.Script(`[1, 0, 1, 0, 1, 0, 1, 1]`), // Rule 171
  Type.Script(`[1, 0, 1, 0, 1, 1, 0, 0]`), // Rule 172
  Type.Script(`[1, 0, 1, 0, 1, 1, 0, 1]`), // Rule 173
  Type.Script(`[1, 0, 1, 0, 1, 1, 1, 0]`), // Rule 174
  Type.Script(`[1, 0, 1, 0, 1, 1, 1, 1]`), // Rule 175
  Type.Script(`[1, 0, 1, 1, 0, 0, 0, 0]`), // Rule 176
  Type.Script(`[1, 0, 1, 1, 0, 0, 0, 1]`), // Rule 177
  Type.Script(`[1, 0, 1, 1, 0, 0, 1, 0]`), // Rule 178
  Type.Script(`[1, 0, 1, 1, 0, 0, 1, 1]`), // Rule 179
  Type.Script(`[1, 0, 1, 1, 0, 1, 0, 0]`), // Rule 180
  Type.Script(`[1, 0, 1, 1, 0, 1, 0, 1]`), // Rule 181
  Type.Script(`[1, 0, 1, 1, 0, 1, 1, 0]`), // Rule 182
  Type.Script(`[1, 0, 1, 1, 0, 1, 1, 1]`), // Rule 183
  Type.Script(`[1, 0, 1, 1, 1, 0, 0, 0]`), // Rule 184
  Type.Script(`[1, 0, 1, 1, 1, 0, 0, 1]`), // Rule 185
  Type.Script(`[1, 0, 1, 1, 1, 0, 1, 0]`), // Rule 186
  Type.Script(`[1, 0, 1, 1, 1, 0, 1, 1]`), // Rule 187
  Type.Script(`[1, 0, 1, 1, 1, 1, 0, 0]`), // Rule 188
  Type.Script(`[1, 0, 1, 1, 1, 1, 0, 1]`), // Rule 189
  Type.Script(`[1, 0, 1, 1, 1, 1, 1, 0]`), // Rule 190
  Type.Script(`[1, 0, 1, 1, 1, 1, 1, 1]`), // Rule 191
  Type.Script(`[1, 1, 0, 0, 0, 0, 0, 0]`), // Rule 192
  Type.Script(`[1, 1, 0, 0, 0, 0, 0, 1]`), // Rule 193
  Type.Script(`[1, 1, 0, 0, 0, 0, 1, 0]`), // Rule 194
  Type.Script(`[1, 1, 0, 0, 0, 0, 1, 1]`), // Rule 195
  Type.Script(`[1, 1, 0, 0, 0, 1, 0, 0]`), // Rule 196
  Type.Script(`[1, 1, 0, 0, 0, 1, 0, 1]`), // Rule 197
  Type.Script(`[1, 1, 0, 0, 0, 1, 1, 0]`), // Rule 198
  Type.Script(`[1, 1, 0, 0, 0, 1, 1, 1]`), // Rule 199
  Type.Script(`[1, 1, 0, 0, 1, 0, 0, 0]`), // Rule 200
  Type.Script(`[1, 1, 0, 0, 1, 0, 0, 1]`), // Rule 201
  Type.Script(`[1, 1, 0, 0, 1, 0, 1, 0]`), // Rule 202
  Type.Script(`[1, 1, 0, 0, 1, 0, 1, 1]`), // Rule 203
  Type.Script(`[1, 1, 0, 0, 1, 1, 0, 0]`), // Rule 204
  Type.Script(`[1, 1, 0, 0, 1, 1, 0, 1]`), // Rule 205
  Type.Script(`[1, 1, 0, 0, 1, 1, 1, 0]`), // Rule 206
  Type.Script(`[1, 1, 0, 0, 1, 1, 1, 1]`), // Rule 207
  Type.Script(`[1, 1, 0, 1, 0, 0, 0, 0]`), // Rule 208
  Type.Script(`[1, 1, 0, 1, 0, 0, 0, 1]`), // Rule 209
  Type.Script(`[1, 1, 0, 1, 0, 0, 1, 0]`), // Rule 210
  Type.Script(`[1, 1, 0, 1, 0, 0, 1, 1]`), // Rule 211
  Type.Script(`[1, 1, 0, 1, 0, 1, 0, 0]`), // Rule 212
  Type.Script(`[1, 1, 0, 1, 0, 1, 0, 1]`), // Rule 213
  Type.Script(`[1, 1, 0, 1, 0, 1, 1, 0]`), // Rule 214
  Type.Script(`[1, 1, 0, 1, 0, 1, 1, 1]`), // Rule 215
  Type.Script(`[1, 1, 0, 1, 1, 0, 0, 0]`), // Rule 216
  Type.Script(`[1, 1, 0, 1, 1, 0, 0, 1]`), // Rule 217
  Type.Script(`[1, 1, 0, 1, 1, 0, 1, 0]`), // Rule 218
  Type.Script(`[1, 1, 0, 1, 1, 0, 1, 1]`), // Rule 219
  Type.Script(`[1, 1, 0, 1, 1, 1, 0, 0]`), // Rule 220
  Type.Script(`[1, 1, 0, 1, 1, 1, 0, 1]`), // Rule 221
  Type.Script(`[1, 1, 0, 1, 1, 1, 1, 0]`), // Rule 222
  Type.Script(`[1, 1, 0, 1, 1, 1, 1, 1]`), // Rule 223
  Type.Script(`[1, 1, 1, 0, 0, 0, 0, 0]`), // Rule 224
  Type.Script(`[1, 1, 1, 0, 0, 0, 0, 1]`), // Rule 225
  Type.Script(`[1, 1, 1, 0, 0, 0, 1, 0]`), // Rule 226
  Type.Script(`[1, 1, 1, 0, 0, 0, 1, 1]`), // Rule 227
  Type.Script(`[1, 1, 1, 0, 0, 1, 0, 0]`), // Rule 228
  Type.Script(`[1, 1, 1, 0, 0, 1, 0, 1]`), // Rule 229
  Type.Script(`[1, 1, 1, 0, 0, 1, 1, 0]`), // Rule 230
  Type.Script(`[1, 1, 1, 0, 0, 1, 1, 1]`), // Rule 231
  Type.Script(`[1, 1, 1, 0, 1, 0, 0, 0]`), // Rule 232
  Type.Script(`[1, 1, 1, 0, 1, 0, 0, 1]`), // Rule 233
  Type.Script(`[1, 1, 1, 0, 1, 0, 1, 0]`), // Rule 234
  Type.Script(`[1, 1, 1, 0, 1, 0, 1, 1]`), // Rule 235
  Type.Script(`[1, 1, 1, 0, 1, 1, 0, 0]`), // Rule 236
  Type.Script(`[1, 1, 1, 0, 1, 1, 0, 1]`), // Rule 237
  Type.Script(`[1, 1, 1, 0, 1, 1, 1, 0]`), // Rule 238
  Type.Script(`[1, 1, 1, 0, 1, 1, 1, 1]`), // Rule 239
  Type.Script(`[1, 1, 1, 1, 0, 0, 0, 0]`), // Rule 240
  Type.Script(`[1, 1, 1, 1, 0, 0, 0, 1]`), // Rule 241
  Type.Script(`[1, 1, 1, 1, 0, 0, 1, 0]`), // Rule 242
  Type.Script(`[1, 1, 1, 1, 0, 0, 1, 1]`), // Rule 243
  Type.Script(`[1, 1, 1, 1, 0, 1, 0, 0]`), // Rule 244
  Type.Script(`[1, 1, 1, 1, 0, 1, 0, 1]`), // Rule 245
  Type.Script(`[1, 1, 1, 1, 0, 1, 1, 0]`), // Rule 246
  Type.Script(`[1, 1, 1, 1, 0, 1, 1, 1]`), // Rule 247
  Type.Script(`[1, 1, 1, 1, 1, 0, 0, 0]`), // Rule 248
  Type.Script(`[1, 1, 1, 1, 1, 0, 0, 1]`), // Rule 249
  Type.Script(`[1, 1, 1, 1, 1, 0, 1, 0]`), // Rule 250
  Type.Script(`[1, 1, 1, 1, 1, 0, 1, 1]`), // Rule 251
  Type.Script(`[1, 1, 1, 1, 1, 1, 0, 0]`), // Rule 252
  Type.Script(`[1, 1, 1, 1, 1, 1, 0, 1]`), // Rule 253
  Type.Script(`[1, 1, 1, 1, 1, 1, 1, 0]`), // Rule 254
  Type.Script(`[1, 1, 1, 1, 1, 1, 1, 1]`)  // Rule 255
];