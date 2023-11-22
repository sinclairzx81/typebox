import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

// ------------------------------------------------------------------
// Identity Types
// ------------------------------------------------------------------
// prettier-ignore
Expect(Type.Const(undefined)).ToStatic<undefined>()
// prettier-ignore
Expect(Type.Const(null)).ToStatic<null>()
// prettier-ignore
Expect(Type.Const(Symbol())).ToStatic<symbol>()
// prettier-ignore
Expect(Type.Const(1 as const)).ToStatic<1>()
// prettier-ignore
Expect(Type.Const('hello' as const)).ToStatic<'hello'>()
// prettier-ignore
Expect(Type.Const(true as const)).ToStatic<true>()

// ------------------------------------------------------------------
// Complex Types
// ------------------------------------------------------------------
// prettier-ignore
Expect(Type.Const(100n)).ToStatic<bigint>()
// prettier-ignore
Expect(Type.Const(new Date())).ToStatic<Date>()
// prettier-ignore
Expect(Type.Const(new Uint8Array())).ToStatic<Uint8Array>()
// prettier-ignore
Expect(Type.Const(function () {})).ToStatic<() => unknown>()
// prettier-ignore
Expect(Type.Const((function *(): any {})())).ToStatic<any>()
// prettier-ignore
Expect(Type.Const((async function *(): any {})())).ToStatic<any>()
// todo: remove when dropping TS 4.0
// prettier-ignore
Expect(Type.Const({ x: 1, y: { z: 2 } })).ToStatic<{ readonly x: number, readonly y: { readonly z: number }}>()
// prettier-ignore
Expect(Type.Const({ x: 1, y: { z: 2 } } as const)).ToStatic<{ readonly x: 1, readonly y: { readonly z: 2 }}>()
// prettier-ignore
Expect(Type.Const([1, 2, 3] as const)).ToStatic<[1, 2, 3]>()
