import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Uppercase(Type.Literal('hello'))).ToStatic<'HELLO'>()

Expect(Type.Uppercase(Type.Union([Type.Literal('hello'), Type.Literal('world')]))).ToStatic<'HELLO' | 'WORLD'>()

Expect(Type.Uppercase(Type.TemplateLiteral('HELLO${0|1}'))).ToStatic<'HELLO0' | 'HELLO1'>()

// prettier-ignore
Expect(Type.Uppercase(Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal(1), Type.Literal(2)])]))).ToStatic<'HELLO1' | 'HELLO2'>()

// passthrough
Expect(Type.Uppercase(Type.Object({ x: Type.Number() }))).ToStatic<{ x: number }>()
