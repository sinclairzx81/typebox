import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Lowercase(Type.Literal('HELLO'))).ToInfer<'hello'>()

Expect(Type.Lowercase(Type.Union([Type.Literal('HELLO'), Type.Literal('WORLD')]))).ToInfer<'hello' | 'world'>()

Expect(Type.Lowercase(Type.TemplateLiteral('HELLO${0|1}'))).ToInfer<'hello0' | 'hello1'>()

// passthrough
Expect(Type.Lowercase(Type.Object({ x: Type.Number() }))).ToInfer<{ x: number }>()
