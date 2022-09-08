import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

import { Node, PerspectiveCamera, Mesh } from './three'

const T1 = Type.Object({
  type: Type.Literal('A'),
  value: Type.String()
})

const T2 = Type.Object({
  type: Type.Literal('B'),
  value: Type.String()
})

const T = Type.Union([])

const A = Value.Create(T1)


const X = Value.Cast(T, '')


