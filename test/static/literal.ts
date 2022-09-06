import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Literal('hello')).ToInfer<'hello'>()

Expect(Type.Literal(true)).ToInfer<true>()

Expect(Type.Literal(42)).ToInfer<42>()
