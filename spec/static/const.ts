import { Type, Static } from '@sinclair/typebox'

// -------------------------------------

const T0 = Type.Const('foo')
const F0 = (arg: Static<typeof T0>) => {}
F0('foo')

// -------------------------------------

const T1 = Type.Const(15)
const F1 = (arg: Static<typeof T1>) => {}
F1(15)

// -------------------------------------

const TU0 = Type.Const('bar')
const TU1 = Type.Const(10)
const TU = Type.Union([TU0, TU1])
const F2 = (arg: Static<typeof TU>) => {}
F2('bar')
F2(10)

// -------------------------------------

const O0 = Type.Object({
  key: Type.Const('foo')
})
const O1 = Type.Object({
  key: Type.Const('bar')
})
const TU2 = Type.Union([O0, O1])
const F3 = (arg: Static<typeof TU2>) => {}
F3({ key: 'foo' })
