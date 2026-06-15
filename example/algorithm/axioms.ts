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
//
// Peano Axioms via Type.Script(...)
//
// https://en.wikipedia.org/wiki/Peano_axioms
//
// Compute Time: 30 seconds approx
//
// ------------------------------------------------------------------

import Type from 'typebox'

console.time()
console.log('Solving ... ')
const { Result } = Type.Script(`

  // --------------------------------------------------------------
  // Peano encoding
  // --------------------------------------------------------------

  type Zero    = { _tag: "zero" }
  type Succ<N> = { _tag: "succ"; prev: N }

  type N0  = Zero
  type N1  = Succ<N0>
  type N2  = Succ<N1>
  type N3  = Succ<N2>
  type N4  = Succ<N3>
  type N5  = Succ<N4>
  type N6  = Succ<N5>
  type N7  = Succ<N6>
  type N8  = Succ<N7>
  type N9  = Succ<N8>

  type N16 =
    Succ<Succ<Succ<Succ<Succ<Succ<Succ<N9>>>>>>>

  type N27 =
    Succ<Succ<Succ<Succ<Succ<Succ<Succ<Succ<
    Succ<Succ<Succ<Succ<Succ<Succ<Succ<Succ<
    Succ<Succ<N9>>>>>>>>>>>>>>>>>>

  // --------------------------------------------------------------
  // Operations
  // --------------------------------------------------------------

  // Add(A, 0)    = A
  // Add(A, S(B)) = S(Add(A, B))
  type Add<A, B> =
    B extends Zero
      ? A
      : B extends Succ<infer P>
        ? Succ<Add<A, P>>
        : never

  // Mul(A, 0)    = 0
  // Mul(A, S(B)) = Add(A, Mul(A, B))
  type Mul<A, B> =
    B extends Zero
      ? Zero
      : B extends Succ<infer P>
        ? Add<A, Mul<A, P>>
        : never

  // Exp(A, 0)    = 1
  // Exp(A, S(B)) = Mul(A, Exp(A, B))
  type Exp<A, B> =
    B extends Zero
      ? N1
      : B extends Succ<infer P>
        ? Mul<A, Exp<A, P>>
        : never

  // Pred(0)    = 0
  // Pred(S(N)) = N
  type Pred<N> =
    N extends Succ<infer P>
      ? P
      : Zero

  // Sub(A, 0)    = A
  // Sub(A, S(B)) = Pred(Sub(A, B))
  // Monus: truncates at zero when B > A
  type Sub<A, B> =
    B extends Zero
      ? A
      : B extends Succ<infer P>
        ? Pred<Sub<A, P>>
        : never

  // --------------------------------------------------------------
  // Relations
  // --------------------------------------------------------------

  // A <= B  iff  Sub(A, B) = 0
  type Lte<A, B> =
    Sub<A, B> extends Zero ? true : false

  // A > B  iff  not (A <= B)
  type Gt<A, B> =
    Lte<A, B> extends true ? false : true

  // A = B  iff  A extends B  and  B extends A
  type Equal<A, B> =
    [A] extends [B]
      ? [B] extends [A]
        ? true
        : false
      : false

  // A | B with witness K  iff  Mul(A, K) = B
  type Divides<A, K, B> = Equal<Mul<A, K>, B>

  // --------------------------------------------------------------
  // Logic
  // --------------------------------------------------------------

  type And<A extends boolean, B extends boolean> =
    A extends true
      ? B extends true
        ? true
        : false
      : false

  // --------------------------------------------------------------
  // Basic arithmetic
  // --------------------------------------------------------------

  type P1  = Equal<Add<N2, N2>, N4>          // 2 + 2 = 4
  type P2  = Equal<Mul<N2, N3>, N6>          // 2 * 3 = 6
  type P3  = Equal<Exp<N2, N3>, N8>          // 2^3 = 8
  type P4  = Equal<Exp<N2, N4>, N16>         // 2^4 = 16
  type P5  = Equal<Exp<N3, N3>, N27>         // 3^3 = 27

  // --------------------------------------------------------------
  // Identity elements
  // --------------------------------------------------------------

  type P6  = Equal<Add<N0, N3>, N3>          // 0 + 3 = 3
  type P7  = Equal<Mul<N1, N3>, N3>          // 1 * 3 = 3
  type P8  = Equal<Exp<N2, N0>, N1>          // 2^0 = 1
  type P9  = Equal<Exp<N3, N0>, N1>          // 3^0 = 1

  // --------------------------------------------------------------
  // Commutativity (concrete witnesses)
  // --------------------------------------------------------------

  type P10 = Equal<Add<N1, N2>, Add<N2, N1>> // 1+2 = 2+1
  type P11 = Equal<Mul<N2, N3>, Mul<N3, N2>> // 2*3 = 3*2

  // --------------------------------------------------------------
  // Associativity (concrete witnesses)
  // --------------------------------------------------------------

  // (1 + 2) + 3 = 1 + (2 + 3)
  type P12 = Equal<
    Add<Add<N1, N2>, N3>,
    Add<N1, Add<N2, N3>>
  >

  // (2 * 3) * 2 = 2 * (3 * 2)
  type P13 = Equal<
    Mul<Mul<N2, N3>, N2>,
    Mul<N2, Mul<N3, N2>>
  >

  // --------------------------------------------------------------
  // Predecessor and subtraction
  // --------------------------------------------------------------

  type P14 = Equal<Pred<N4>, N3>             // Pred(4) = 3
  type P15 = Equal<Sub<N5, N3>, N2>          // 5 - 3 = 2
  type P16 = Equal<Sub<N3, N3>, N0>          // 3 - 3 = 0
  type P17 = Equal<Sub<N3, N5>, N0>          // 3 - 5 = 0 (monus)

  // --------------------------------------------------------------
  // Add and Sub are inverses
  // --------------------------------------------------------------

  // (3 + 4) - 4 = 3
  type P18 = Equal<Sub<Add<N3, N4>, N4>, N3>
  // (2 + 5) - 5 = 2
  type P19 = Equal<Sub<Add<N2, N5>, N5>, N2>
  // (7 - 3) + 3 = 7
  type P20 = Equal<Add<Sub<N7, N3>, N3>, N7>

  // --------------------------------------------------------------
  // Order relations
  // --------------------------------------------------------------

  type P21 = Lte<N2, N5>                     // 2 <= 5
  type P22 = Lte<N5, N5>                     // 5 <= 5 (reflexivity)
  type P23 = Gt<N7, N4>                      // 7 > 4
  type P24 = Gt<N3, N0>                      // 3 > 0
  type P25 = Lte<Add<N2, N3>, Mul<N2, N3>>   // 5 <= 6
  type P26 = Gt<Mul<N2, N3>, N4>             // 6 > 4

  // --------------------------------------------------------------
  // Exponentiation laws
  // --------------------------------------------------------------

  // 2^2 * 2^2 = 2^4   (A^M * A^N = A^(M+N))
  type P27 = Equal<
    Mul<Exp<N2, N2>, Exp<N2, N2>>,
    Exp<N2, N4>
  >

  // (2^2)^2 = 2^4     ((A^M)^N = A^(M*N))
  type P28 = Equal<Exp<Exp<N2, N2>, N2>, Exp<N2, N4>>

  type P29 = Gt<Exp<N2, N3>, Exp<N2, N2>>   // 8 > 4
  type P30 = Gt<Exp<N3, N2>, Exp<N2, N3>>   // 9 > 8
  type P31 = Lte<Exp<N2, N4>, Exp<N3, N3>>  // 16 < 27

  // --------------------------------------------------------------
  // Divisibility witnesses
  // --------------------------------------------------------------

  type P32 = Divides<N3, N3, N9>             // 3 | 9
  type P33 = Divides<N2, N4, N8>             // 2 | 8
  type P34 = Divides<N4, N4, N16>            // 4 | 16
  type P35 = Divides<N3, N9, N27>            // 3 | 27
  type P36 = Divides<N2, N8, N16>            // 2 | 16

  // --------------------------------------------------------------
  // Results
  // --------------------------------------------------------------

  type All =
    And<
      And<
        And<And<P1,  P2>,  And<P3,  P4>>,
        And<And<P5,  P6>,  And<P7,  P8>>
      >,
      And<
        And<And<P9,  P10>, And<P11, P12>>,
        And<And<P13, P14>, And<P15, P16>>
      >,
      And<
        And<And<P17, P18>, And<P19, P20>>,
        And<And<P21, P22>, And<P23, P24>>
      >,
      And<
        And<And<P25, P26>, And<P27, P28>>,
        And<P29, And<P30, And<P31,
        And<P32, And<P33, And<P34,
        And<P35, P36>>>>>>>
      >
    >

  type Result = All extends true ? "QED" : never

` as never) as never
console.log({ Result })      // { type: "string", const: "QED" }
console.timeEnd()