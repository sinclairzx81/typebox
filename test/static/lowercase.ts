import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Lowercase(Type.Literal('HELLO'))).ToInfer<'hello'>()
