import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Uncapitalize(Type.Literal('HELLO'))).ToInfer<'hELLO'>()

Expect(Type.Uncapitalize(Type.Union([Type.Literal('HELLO'), Type.Literal('WORLD')]))).ToInfer<'hELLO' | 'wORLD'>()

Expect(Type.Uncapitalize(Type.TemplateLiteral('HELLO${0|1}'))).ToInfer<'hELLO0' | 'hELLO1'>()

// prettier-ignore
Expect(Type.Uncapitalize(Type.TemplateLiteral([Type.Literal('HELLO'), Type.Union([Type.Literal(1), Type.Literal(2)])]))).ToBe<'hELLO1' | 'hELLO2'>()

// passthrough
Expect(Type.Uncapitalize(Type.Object({ x: Type.Number() }))).ToInfer<{ x: number }>()
