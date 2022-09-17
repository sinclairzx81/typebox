import { TypeBoxCodegen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static, TString } from '@sinclair/typebox'

const T = Type.String()

const R = [...ValuePointer.Format('/x/a~1b')]

console.log(R)



