import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

Expect(Type.Uncapitalize(Type.Literal('HELLO'))).ToInfer<'hELLO'>()

Expect(Type.Uncapitalize(Type.Union([Type.Literal('HELLO'), Type.Literal('WORLD')]))).ToInfer<'hELLO' | 'wORLD'>()

Expect(Type.Uncapitalize(Type.TemplateLiteral('HELLO${0|1}'))).ToInfer<'hELLO0' | 'hELLO1'>()

// passthrough
Expect(Type.Uncapitalize(Type.Object({ x: Type.Number() }))).ToInfer<{ x: number }>()
