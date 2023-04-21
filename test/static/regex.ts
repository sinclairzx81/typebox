import { Expect } from './assert.js'
import { Type } from '@sinclair/typebox'

Expect(Type.RegEx(/foo/)).ToInfer<string>()
