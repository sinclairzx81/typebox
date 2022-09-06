import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.RegEx(/foo/)).ToInfer<string>()
