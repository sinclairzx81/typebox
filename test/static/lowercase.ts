import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Lowercase(Type.Literal('HELLO'))).ToStatic<'hello'>()

Expect(Type.Lowercase(Type.Union([Type.Literal('HELLO'), Type.Literal('WORLD')]))).ToStatic<'hello' | 'world'>()

Expect(Type.Lowercase(Type.TemplateLiteral('HELLO${0|1}'))).ToStatic<'hello0' | 'hello1'>()

// prettier-ignore
Expect(Type.Lowercase(Type.TemplateLiteral([Type.Literal('HELLO'), Type.Union([Type.Literal(1), Type.Literal(2)])]))).ToStatic<'hello1' | 'hello2'>()

// passthrough
Expect(Type.Lowercase(Type.Object({ x: Type.Number() }))).ToStatic<{ x: number }>()
