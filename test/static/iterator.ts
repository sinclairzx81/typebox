import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Iterator(Type.String())).ToInfer<IterableIterator<string>>()
