import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

enum E {
  A,
  B = 'hello',
  C = 42,
}

const T = Type.Enum(E)

Expect(T).ToBe<Static<typeof T>>() // ?
