import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Capitalize(Type.Literal('hello'))).ToInfer<'Hello'>()
