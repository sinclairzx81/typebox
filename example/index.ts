import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type, Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

// todo: implement Value.Equals() tests
// todo: implement Value.Clone() tests
// todo: implement TypeArray tests (Delta)

const A = { x: 1, y: 2 }

const B = { x: 3 }

const D = Value.Diff<any>(A, B)                                           //   { type: 'insert', path: '/w', value: 6 },
    
console.log(D)