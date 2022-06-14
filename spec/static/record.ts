import * as Spec from './spec'
import { Type } from './typebox'
{
    // type K = string
    const K = Type.String()

    Spec.expectType<
        Record<string, number>
    >(Spec.infer(
        Type.Record(K, Type.Number()))
    )
}
{
    // type K = string
    const K = Type.RegEx(/foo|bar/)

    Spec.expectType<
        Record<string, number>
    >(Spec.infer(
        Type.Record(K, Type.Number()))
    )
}
{
    // type K = number
    const K = Type.Number()

    Spec.expectType<
        Record<string, number>
    >(Spec.infer(
        Type.Record(K, Type.Number()))
    )

    Spec.expectType<
        Record<number, number>
    >(Spec.infer(
        Type.Record(K, Type.Number()))
    )
}
{
    // type K = 'A' | 'B' | 'C'
    const K = Type.Union([
        Type.Literal('A'),
        Type.Literal('B'),
        Type.Literal('C')
    ])

    Spec.expectType<
        Record<'A' | 'B' | 'C', number>
    >(Spec.infer(
        Type.Record(K, Type.Number()))
    )
}
{
    // type K = keyof { A: number, B: number, C: number }
    const K = Type.KeyOf(
        Type.Object({
            A: Type.Number(),
            B: Type.Number(),
            C: Type.Number()
        })
    )
    Spec.expectType<
        Record<'A' | 'B' | 'C', number>
    >(Spec.infer(
        Type.Record(K, Type.Number()))
    )
}
{
    // type K = keyof Omit<{ A: number, B: number, C: number }, 'C'>
    const K = Type.KeyOf(
        Type.Omit(
            Type.Object({
                A: Type.Number(),
                B: Type.Number(),
                C: Type.Number()
            }),
            ['C']
        )
    )
    Spec.expectType<
        Record<'A' | 'B', number>
    >(Spec.infer(
        Type.Record(K, Type.Number()))
    )
}