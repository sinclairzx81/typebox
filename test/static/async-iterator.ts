import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.AsyncIterator(Type.String())).ToInfer<AsyncIterableIterator<string>>()
