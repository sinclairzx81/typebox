# TypeBox TRPC Integration

To use TypeBox with TRPC, you will need to wrap types used on procedures in a TRPC compatible assert function. Once wrapped, TypeBox can offer typical auto type inference for procedures, enhanced runtime checking performance as well as enabling publishable procedure schematics based on the JSON Schema specification.

## Contents

- [Example](#Example)
- [TypeCompiler](#TypeComplier)
- [Value](#Value)
- [Ajv](#Ajv)

## Example

The following shows minimal setup using the `IoType` to provide value assertions for TRPC. See following sections for the implementation of `IoType`.

```typescript
import { Type } from '@sinclair/typebox'
import { initTRPC } from '@trpc/server'
import { IoType } from './io-type'

const addInput = IoType(Type.Object({
  a: Type.Number(),
  b: Type.Number()
}))

const addOutput = IoType(Type.Number())

const t = initTRPC.create()

export const appRouter = t.router({
  add: t.procedure
    .input(addInput)
    .output(addOutput)
    .query(({ input }) => input.a + input.b) // type-safe
})
```

<a name="TypeCompiler"></a>

## With [TypeCompiler](https://www.typescriptlang.org/dev/bug-workbench/?target=99&lib=true&ts=4.7.4#code/PTAEAEDMEsBsFMB2BDAtvAXKaB7AtAC4CeADvAHQEDOAUNKiTgE4GgDeoAKgMoDGAFvFTJQAX1CQmOVKADk4KtES9YyaE2DEyAIxwAPWXQbNWHTqXgBhaSTjwmYiVJnzFy1es0Xde4Lxt2TIb0jCzsXABKAAqWAKJMUg7iktJy4ARMJLzAVPYAbvaGNPB6oaz+iFSsAJI45mSgALygADycoCUESAAmVFx8gsIAfAAUVAJCyFicADSgTPCQ9ki88FTTA5MA2gC6TaC7AJRNQ+w0oKAVVZeCvADW+-VWAQhM5NYMdmMTwnMLSwtlGtDud5vACABXJiIUAjPLIWAQzCgCGIO6IHAAd0Qx0apwm93etzucIRSOOAH5QPDEfBQFgRiNcac2KCLldTKASMgCPw5ugqFRkABzOniZpbchSgl3cjxRJUUm0w47LYABh2bNAvKkmNAiHges40TiCWYIw4AqFoqwAAMACRsK0i+DJZigR3c3miW1zfzdZGyABCAEEACIAfQisQAigBVWLcTiyMQgi6iQ5MmiiGg0EAQGAIFDoLBSCFdN7UIxlcJKaAEY0xRwpFzpTLZXJMApBasmcJPZvONJuFRqDRaeA+YLGMIcWoD5JD2TkYC4QgWIoc0DIbrdaqIEjl-bziwjJ7kADy2gAVvBeAQLaCplwLOQAHIQ1DaexMmag7TTK+H5fj+IIZiCNBbju3QXuWh6sM0J5kGeQGft+TBMhBW4IdgiD1o2ljkLwCw8vAWbFKUfZQSQJARDg5b2PsBDkGWFaPhc0FYMxJBSKs3RQvAWrkEo8EjNB+7wWmFygOQ9EEKJ0GwfJ5ZSRc5AAI5IkwRCMhwIlHhmJy4fB5AiAA1MZ5bkNoxz5hOeBCks2aHEAA)

The following uses the TypeCompiler to perform JIT optimized type checking for TRPC.

```typescript
import { TSchema } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TRPCError } from '@trpc/server'

export const IoType = <T extends TSchema>(schema: T, references: TSchema[] = []) => {
  const check = TypeCompiler.Compile(schema, references)
  return (value: unknown) => check.Check(value) ? value : (() => {
    const { path, message } = [...check.Errors(value)][0]
    throw new TRPCError({ message: `${message} for ${path}`, code: 'BAD_REQUEST' })
  })()
}
```

<a name="Value"></a>

## With [Value](https://www.typescriptlang.org/dev/bug-workbench/?target=99&lib=true&ts=4.7.4#code/PTAEAEDMEsBsFMB2BDAtvAXKaB7AtAC4CeADvAHQEDOAUNKiTgE4GgDeoAasrAK7ygAvqEhMcqUAHJwVaIgDGsZNCbBiZAEY4AHsABuPfpLoNmrDgBUAyvIAW8VMiEixE6bIVKVa0vC3bjekYWdlALACUABQBhAFEmMSZnUXEpcAImEnlgKngmPTzjGnhtYNZ5HEQqVgBJHAtfUABeUAAeC1ASgiQAEyowm3tHAD4ACio7B2QsCwAaUCZ4SDykeXgqGcGpgG0AXWbQPYBKZuHQGlBQUYM+TFBeRABrRBwAd0QTprPuW-Jo+3kj3Gk0c8xu-BOAH5QOCBFhRqNPmc2BdLqAKlVzKASMgCLZ5ugqFRkABzATCFrbcjUn78cjxRJUYFDZDzRbLRYKdZgwzwI67bYABl2qMueLEr1AiHgkoiMQZzFGHEJxLJWAABgASNgq0nwYSQZigbU4vGCdXzCo9O6SABCAEEACIAfXCsQAigBVWJWCySIRHVGCI6Img0EAQGAIFDoLBiXjdJiUWhBMyhOTQAhy6LJVxpDJZHJ5ApMQKmEKWRoGvPuOSKZSqdR+HRlsqhOoNMi51KScjAXCEXxFDHVUDIHo9GqIEgJg4d3yjTsUADyGgAVvB5AQlajpmFfOQAHK8VAaPKI2aojQzA-H0-nwPBwM0Eescc9ZcJmesFrzsiL28TzPJhEWfV9QB-bBEEzbNyHkRZcXgUNilKNNwOQEgSHCHAEzyA4CHIeNEx3S53ywAiSDENYel4RZRVAcg5G-UZ3ynb9AzRBicIIZj30-HiEw4tFyAAR34JgiARDgmNnYNTig79yCcABqBSE3IDQTgjJs8GJZYaGDIA)

The following performs dynamic type checking without code evaluation.

```typescript
import { Value } from '@sinclair/typebox/value'
import { TSchema } from '@sinclair/typebox'
import { TRPCError } from '@trpc/server'

export const IoType = <T extends TSchema>(schema: T, references: TSchema[] = []) => 
  (value: unknown) => Value.Check(schema, value) ? value : (() => {
    const { path, message } = [...Value.Errors(schema, references, value)][0]
    throw new TRPCError({ message: `${message} for ${path}`, code: 'BAD_REQUEST' })
  })()
```

<a name="Ajv"></a>

## With [Ajv](https://www.typescriptlang.org/dev/bug-workbench/?target=99&lib=true&ts=4.7.4#code/PTAEAEDMEsBsFMB2BDAtvAXKaB7AtAC4CeADvAHQEDOAUNKiTgE4GgDeoAKgMoDGAFvFTIANKG4FkBaL1ABfUJCY5UoAOTgq0RL1jJoTYMTIAjHAA81dBs1YdOAJQAKAYQCiTZU3mLlqjQRMJLzAVPBMAG7hVvSMLKAAggBWEb4q6sgpwAAm0FQEwABMAAwlVjTw5nGsvDiI+aAAkjicpPCgALygADycoJUESNlUXHyCwgB8ABRUAkLIWJxiTPCQ4Ui88FSLY-MA2gC6naCHAJSdE+w0oKC19ayZqV2I8ADuiSlTp9egK2srOi25EgzDcyAEUz+60BF1Aj3IyGy2V2wkhq2hm1O3xudwac14AGtjvDagw4PAZnNhNjfvACABXJiIUBTCLIWD0zCgemIAmIHCvRCnLASKQyXqXDqXfEE1nsznnAD8oDZHPaWCmX1hbB+OLqDQ46CoVGQAHN4GJtPlkICnFJ+D4ujLyOEvFQAIR7YoHXWgAj8ZTvF7vRyuDxeKaGrYm81YUAAAwAJGwjTH4AoQd5k1bJLb7XJ42JatkuWoAEIJAAiAH0HG4AIoAVTc3E4ankNLkpy+NDkNBoIAgMAQKHQWGU9MGTEotFitnY2EQ0AIoZcPiU6QCQRCYUi0Ws1QXrTI6786k02l0+kMxngZksB-nHGax-aGbPanIwFwhDa5VxDxIo0iAkJOxwvm0UyvuQADyJhJPAvAEJGPwLFwbTkAAcvSqAmOEXwiD8JiLBh2G4fh3xdt8NAAXCSIwZOoGsF0EFkFBpE4XhTBfNRtHMYuy6ruQvArFIFLUZUh60cgJAkA4OCTuExwEOQE5TihNyItkWAqSQyibNkjLwL65DaExUxacBTE0jc5AKQQ5laQxDmTjZoDkAAjpyTBEJqHBmWBXawgFKnIKAADUi5MeQJjnIOt54Caay9qcQA)


The following uses Ajv to perform more generalized JSON Schema checks across the complete JSON Schema specification.

```typescript
import { TSchema, Static } from '@sinclair/typebox'
import { TRPCError } from '@trpc/server'
import Ajv from 'ajv/dist/2020'

export const IoType = <T extends TSchema>(schema: T, references: TSchema[] = []) => {
  const ajv = new Ajv()
  references.forEach(reference => ajv.addSchema(reference))
  const check = ajv.compile(schema)
  return (value: unknown): Static<T> => check(value) ? value : (() => {
    const { message, instancePath } = check.errors![0]
    throw new TRPCError({ message:  `${message} for ${instancePath}`, code: 'BAD_REQUEST' })
  })()
}
```