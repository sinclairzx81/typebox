import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Capitalize(Type.Literal('hello'))).ToInfer<'Hello'>()

Expect(Type.Capitalize(Type.Union([Type.Literal('hello'), Type.Literal('world')]))).ToInfer<'Hello' | 'World'>()

Expect(Type.Capitalize(Type.TemplateLiteral('hello${0|1}'))).ToInfer<'Hello0' | 'Hello1'>()

// passthrough
Expect(Type.Capitalize(Type.Object({ x: Type.Number() }))).ToInfer<{ x: number }>()
