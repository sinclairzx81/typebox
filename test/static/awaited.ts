import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Awaited(Type.String())).ToStatic<string>()

Expect(Type.Awaited(Type.Promise(Type.String()))).ToStatic<string>()

Expect(Type.Awaited(Type.Promise(Type.Promise(Type.String())))).ToStatic<string>()

// One Level

Expect(Type.Awaited(Type.Union([Type.Promise(Type.String()), Type.Number()]))).ToStatic<string | number>()

Expect(Type.Awaited(Type.Intersect([Type.Promise(Type.String()), Type.Number()]))).ToStatic<string & number>()

// Two Levels

Expect(Type.Awaited(Type.Union([Type.Promise(Type.Promise(Type.String())), Type.Number()]))).ToStatic<string | number>()

Expect(Type.Awaited(Type.Intersect([Type.Promise(Type.Promise(Type.String())), Type.Number()]))).ToStatic<string & number>()
