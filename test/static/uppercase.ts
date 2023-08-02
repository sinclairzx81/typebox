import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Uppercase(Type.Literal('hello'))).ToInfer<'HELLO'>()

Expect(Type.Uppercase(Type.Union([Type.Literal('hello'), Type.Literal('world')]))).ToInfer<'HELLO' | 'WORLD'>()

Expect(Type.Uppercase(Type.TemplateLiteral('HELLO${0|1}'))).ToInfer<'HELLO0' | 'HELLO1'>()

// passthrough
Expect(Type.Uppercase(Type.Object({ x: Type.Number() }))).ToInfer<{ x: number }>()
