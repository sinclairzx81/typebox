import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Uncapitalize(Type.Literal('HELLO'))).ToInfer<'hELLO'>()
