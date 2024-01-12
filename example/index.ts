import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'

import { Type, TNever, KeyOfPropertyKeys, Static, Assert, Evaluate, Ensure, TSchema, TObject, TIntersectEvaluated, TKeyOfPropertyKeys, TIndexFromPropertyKeys, TIndex } from '@sinclair/typebox'
import * as Sets from '../src/type/sets/index'

// prettier-ignore
export type TCompositeKeys<T extends TSchema[], Acc extends PropertyKey[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TCompositeKeys<R, [...Acc, ...TKeyOfPropertyKeys<L>]>
    : Acc
)
// prettier-ignore
function CompositeKeys<T extends TSchema[]>(schema: [...T]): TCompositeKeys<T> {
  throw 1
}
// prettier-ignore
export type TFilterNever<T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? L extends TNever 
      ? Acc 
      : TFilterNever<R, [...Acc, L]>
    : Acc
)
// prettier-ignore
function FilterNever<T extends TSchema[]>(schema: [...T]): TFilterNever<T> {
  throw 1
}
// prettier-ignore
export type TCompositeProperty<T extends TSchema[], K extends PropertyKey, Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
   ? TCompositeProperty<R, K, TFilterNever<[...Acc, ...TIndexFromPropertyKeys<L, [K]>]>>
   : Acc
)
// prettier-ignore
function CompositeProperty<T extends TSchema[], K extends PropertyKey>(schema: [...T], keys: K): TCompositeProperty<T, K> {
  throw 1
}
// prettier-ignore
export type TCompositeProperties<T extends TSchema[], K extends PropertyKey[], Acc = {}> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TCompositeProperties<T, R, Acc & { [_ in L]: TIntersectEvaluated<TCompositeProperty<T, L>> }>
    : Acc
)
// prettier-ignore
function CompositeProperties<T extends TSchema[], K extends PropertyKey[]>(schema: [...T]): TCompositeProperties<T, K> {
  throw 1
}

// prettier-ignore
export type TComposite<T extends TSchema[], K extends PropertyKey[] = TCompositeKeys<T>> = (
  Ensure<TObject<Evaluate<TCompositeProperties<T, K>>>>
)

// prettier-ignore
function Composite<T extends TSchema[]>(schema: [...T]): TComposite<T> {
  throw 1
}

type X = Sets.TSetIntersectMany<[['a'], ['y']]>

const A = Composite([Type.String(), Type.Number(), Type.Intersect([Type.Object({ c: Type.String() }), Type.Object({ c: Type.Number() })]), Type.Union([Type.Object({ c: Type.String() }), Type.Object({ c: Type.Number() })])])

type K = ({ x: number } | { x: string }) & ({ x: number } & { x: string })

function test(value: K) {}
