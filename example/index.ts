import { TypeBuilder, TSchema, Static } from '@sinclair/typebox'

// -----------------------------------------------------------
// Open API Extended Types
// -----------------------------------------------------------

export type TNullable<T extends TSchema> = TSchema & {
    ['typebox:output']: Static<T> | null
} & { nullable: true }

export type TStringUnion<T extends string[]> = TSchema & {
    ['typebox:output']: {[K in keyof T]: T[K] }[number]
    enum: T
}

// -----------------------------------------------------------
// Open API TypeBuilder
// -----------------------------------------------------------

export class OpenApiTypeBuilder extends TypeBuilder {
    public Nullable<T extends TSchema>(schema: T): TNullable<T> {
        return { ...schema, nullable: true } as any
    }

    public StringUnion<T extends string[]>(values: [...T]): TStringUnion<T> {
        return { enum: values } as any
    }
}

const Type = new OpenApiTypeBuilder()

// -----------------------------------------------------------
// Example
// -----------------------------------------------------------

const A = Type.StringUnion(['A', 'B', 'C'])

const B = Type.Nullable(Type.String())

type A  = Static<typeof A>

type B  = Static<typeof B>


