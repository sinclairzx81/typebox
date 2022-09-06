import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Null()).ToInfer<null>()
