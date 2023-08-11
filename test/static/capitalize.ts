import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Capitalize(Type.Literal('hello'))).ToStatic<'Hello'>()

Expect(Type.Capitalize(Type.Union([Type.Literal('hello'), Type.Literal('world')]))).ToStatic<'Hello' | 'World'>()

Expect(Type.Capitalize(Type.TemplateLiteral('hello${0|1}'))).ToStatic<'Hello0' | 'Hello1'>()

// prettier-ignore
Expect(Type.Capitalize(Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal(1), Type.Literal(2)])]))).ToStatic<'Hello1' | 'Hello2'>()

// passthrough
Expect(Type.Capitalize(Type.Object({ x: Type.Number() }))).ToStatic<{ x: number }>()
