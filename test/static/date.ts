import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Date()).ToInfer<Date>()
