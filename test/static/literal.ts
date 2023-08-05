import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Literal('hello')).ToStatic<'hello'>()

Expect(Type.Literal(true)).ToStatic<true>()

Expect(Type.Literal(42)).ToStatic<42>()
