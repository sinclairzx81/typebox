import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Custom } from '@sinclair/typebox/custom'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Static, Type } from '@sinclair/typebox'
import { TypeArray, TypeMap } from './collections'

const map = new Map([
  [{ x: 1, y: 2 }, 1],
  [{ x: 2, y: 3 }, 1],
  [{ x: 4, y: 5 }, 1],
])

const typemap = new TypeMap(
  Type.Object({
    x: Type.Number(),
    y: Type.Number(),
  }),
  Type.Number(),
  map,
)
