import { CodeGen } from '@sinclair/typebox/codegen'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Conditional } from '@sinclair/typebox/conditional'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Format } from '@sinclair/typebox/format'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, Static, TSchema } from '@sinclair/typebox'
import Ajv from 'ajv'


type AA = {} extends Date ? 1: 2

const CC = Conditional.Extends(Type.Date(), Type.Object({}), Type.Literal('true'), Type.Literal('false'))

console.log(CC)

// --------------------------------------------------------------
// Reference Ajv Configuration
//
// Include in documentation
// --------------------------------------------------------------
function TypeOf(of: string, value: unknown, schema: unknown) {
    switch (of) {
        case 'Constructor': return TypeGuard.TConstructor(schema) && Value.Check(schema, value)
        case 'Function': return TypeGuard.TFunction(schema) && Value.Check(schema, value)
        case 'Date': return TypeGuard.TDate(schema) && Value.Check(schema, value)
        case 'Promise': return TypeGuard.TPromise(schema) && Value.Check(schema, value)
        case 'Uint8Array': return TypeGuard.TUint8Array(schema) && Value.Check(schema, value)
        case 'Undefined': return TypeGuard.TUndefined(schema) && Value.Check(schema, value)
        case 'Void': return TypeGuard.TVoid(schema) && Value.Check(schema, value)
        default: return false
    }
}

const ajv = new Ajv()
     .addKeyword({ type: 'object', keyword: 'instanceOf', validate: TypeOf })
     .addKeyword({ type: 'null', keyword: 'typeOf', validate: TypeOf })

const T = Type.Object({
    date: Type.Date(),
    buf: Type.Uint8Array(),
    void: Type.Void()
})

console.log('undefined', TypeGuard.TUndefined(Type.Undefined()))
console.log('void', TypeGuard.TVoid(Type.Void()))

const check = ajv.compile(T)
console.log('result', check({
    date: new Date(),
    buf: new Uint8Array(),
    // asd: undefined,
    void: null
}))


console.log(Type.Void())