import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.RegExp(/foo/)).ToInfer<string>()
