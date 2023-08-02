import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Capitalize(Type.Literal('hello'))).ToInfer<'Hello'>()

Expect(Type.Capitalize(Type.Union([Type.Literal('hello'), Type.Literal('world')]))).ToInfer<'Hello' | 'World'>()

Expect(Type.Capitalize(Type.TemplateLiteral('hello${0|1}'))).ToInfer<'Hello0' | 'Hello1'>()

// prettier-ignore
Expect(Type.Capitalize(Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal(1), Type.Literal(2)])]))).ToBe<'Hello1' | 'Hello2'>()

// passthrough
Expect(Type.Capitalize(Type.Object({ x: Type.Number() }))).ToInfer<{ x: number }>()
