import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Syntax, TSyntax } from '@sinclair/typebox/syntax'
import { Type, TypeGuard, Kind, Static, TSchema } from '@sinclair/typebox'

// Updates:
//
// renamed Parse() to Syntax()
// updated ReturnType to be TSchema generic
// updated InstanceType to be TSchema generic
// updated Parameters to be TSchema generic
// updated ConstructorParameters to be TSchema generic

const T = Syntax(`new (a: number | number) => string`)

const A = Type.ConstructorParameters(T)

console.log(T)
