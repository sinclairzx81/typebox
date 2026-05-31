import Type from 'typebox'

// investigating Extends logic

const { A, B, C, Vector } = Type.Script(`
  
type A = if number then 1              // 1 | unknown - (technically 1 & (unknown & not number)) 
type B = if number then 1 else 'hello' // 1 | 'hello'
type C = if number then 1 else never   // 1

// which approximates as the following

type IfThenElse<If, Then, Else> = (If & Then) | Exclude<Else, If>

// and would be used in contexts like the following

// Rules
type RuleA = if { x: 1 } then { y: 1 }
type RuleB = if { x: 2 } then { y: 2 }
type RuleC = if { x: 3 } then { y: 3 }


// Vector Intersected with Rules
type Vector = {
  x: number
  y: number
} & if { x: 1 } then { y: 1 } else
    if { x: 2 } then { y: 2 }
`)

type A = Type.Static<typeof A>
type B = Type.Static<typeof B>
type C = Type.Static<typeof C>

type Vector = Type.Static<typeof Vector>



