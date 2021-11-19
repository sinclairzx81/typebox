import * as Spec from './spec'
import { Type } from './typebox'

const T0 = Type.Array(Type.String())

Spec.expectType<string[]>(Spec.infer(T0))

const T1 = Type.Array(Type.Object({
    x: Type.Number(),
    y: Type.Boolean(),
    z: Type.String()
}))

Spec.expectType<{x: number, y: boolean, z: string}[]>(Spec.infer(T1))

const T2 = Type.Array(Type.Array(Type.String()))

Spec.expectType<string[][]>(Spec.infer(T2))

const T3 = Type.Array(Type.Tuple([Type.String(), Type.Number()]))

Spec.expectType<[string, number][]>(Spec.infer(T3))
