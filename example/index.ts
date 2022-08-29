import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'
import { Formats } from '@sinclair/typebox/formats'


Formats.Set('atom', (value) => {
  
  return true
})

const T = Type.String({ format: 'atom' })

const C = TypeCompiler.Compile(T, [])

console.log(C.Check('hello'))

console.log(C.Code())



