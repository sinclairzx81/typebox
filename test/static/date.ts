import { Expect } from './assert.js'
import { Type } from '@sinclair/typebox'

Expect(Type.Date()).ToInfer<Date>()
