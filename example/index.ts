import { Type, Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { TypeCompiler } from '@sinclair/typebox/compiler'

const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
})

const Check = TypeCompiler.Compile(T)

const a: any = Value.Create(T)

Check.Assert(a as Static<typeof T>)



