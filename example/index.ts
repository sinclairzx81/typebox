import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'


const V = {
  x: { 
    y: 1,
    '/': { x: 1 } 
  },
}
console.log(ValuePointer.Get(V, '/x/~1'))
console.log(ValuePointer.Get(V, '/x/y/'))
console.log(ValuePointer.Get(V, '/x/y')) 