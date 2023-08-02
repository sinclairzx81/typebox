import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Uppercase(Type.Literal('hello'))).ToInfer<'HELLO'>()

Expect(Type.Uppercase(Type.Union([Type.Literal('hello'), Type.Literal('world')]))).ToInfer<'HELLO' | 'WORLD'>()

Expect(Type.Uppercase(Type.TemplateLiteral('HELLO${0|1}'))).ToInfer<'HELLO0' | 'HELLO1'>()

// prettier-ignore
Expect(Type.Uppercase(Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal(1), Type.Literal(2)])]))).ToBe<'HELLO1' | 'HELLO2'>()

// passthrough
Expect(Type.Uppercase(Type.Object({ x: Type.Number() }))).ToInfer<{ x: number }>()
