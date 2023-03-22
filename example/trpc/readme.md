# Using TypeBox with TRPC

To use TypeBox with TRPC, you will need to wrap types passed to procedures within a TRPC compatible assertion function. Once wrapped, TypeBox can provide TRPC auto type inference for procedures, enhanced runtime checking performance as well as provide options to enabling publishable procedure schematics based on the JSON Schema specification.

## Contents

- [Example](#Example)
- [RpcType](#RpcType)
  - [TypeCompiler](#TypeCompiler)
  - [Value](#Value)
  - [Ajv](#Ajv)

<a name="Example"></a>

## Example

The following shows a minimal TypeBox + TRPC setup with the `RpcType` wrapper function described in the sections below.

```typescript
import { Type } from '@sinclair/typebox'
import { initTRPC } from '@trpc/server'
import { RpcType } from './rpctype'

const addInput = RpcType(
  Type.Object({
    a: Type.Number(),
    b: Type.Number(),
  }),
)

const addOutput = RpcType(Type.Number())

const t = initTRPC.create()

export const appRouter = t.router({
  add: t.procedure
    .input(addInput)
    .output(addOutput)
    .query(({ input }) => input.a + input.b), // type-safe
})
```

<a name="RpcType"></a>

## RpcType

Unlike Zod, Yup, Superstruct, TypeBox types are pure JSON Schema and do not implement built a in `parse` or `validate` function. Because of this, you will need to wrap the Type in a TRPC compatible function which implements `parse` or `validate` on behalf of TRPC. As JSON Schema is a formal specification, there are a number of ways you can choose to implement this function, the following shows recommended implementations.

<a name="TypeCompiler"></a>

### With [TypeCompiler](https://www.typescriptlang.org/dev/bug-workbench/?target=99&lib=true&ts=4.7.4#code/PTAEAEDMEsBsFMB2BDAtvAXKATgBwMYAuAnrvAHSEDOAUNKrgPbaGgDeoAKgMr4AW8VMlABfUJGyNUoAOTgq0RPljJo2YCTIAjRgA8ZdBs1YdOpeAGEpuOPGyjxk6XIVKVajeZ27g+a7ewDeiYWdi4AJQAFCwBRbEl7MQkpWXBCPHxgKjsANzsDGnhdENZIAFclQmhGRFBwgjMyAB5OUCLCJAATKi5eASEAPgAKKn5BZCxOABoceEg7JHx4Kkm+8YBtAF1QAF5QLYBKdhpQUD9EKlYx-ABrXa5zKwYA8iebBBGxoRnsOYWlZYHE6zQhlbC1IY5ZCwMqYUAVG6IRgAd0QRx2A2Op1O0EgQ2uN1eAlukOhsIOR1+oPBoChMPgwNO50uYVwyEIfBm6CoVGQAHN4A49utyKKCeQ4gkqKT6QdNusAAybRmgDmSZGgRDwDWcKKxeLMIYcbm8gVYAAGABI2Cb+fAksxQNa2RyROaZn5OnCZAAhACCABEAPrhGIARQAqjFuJwZKIgacRDQkzQQBAYAgUOgsJIyh1sJRaMFjGFFNBCLrog5ks40hksrl8oYSmFGoKkk5Uq5lKp1Jp4N4gkZQhx6vg29XOzJyMAMv2CszWMhOp0AJKIXB5+5jttDNvkADyWgAVvAiEbgRMHmRyAA5MqoLR2IYHKbArSTcx3h9P7Av5MUjQNCLqAy6dAeeabqwew7uYe5fvej7PoBwE1Cy0GgGWFZ6uQ+C-Oy8D-oUxQliByC4Lg4SMHmdj3IQ5C5vmF6nGBWD0bgkhLJ0YIMtioDkIoUFDGB65QQm2LkNRhBCWBEHSXm4mnOQACOsLYMQQxGphG5biI6KYoJebkMIADU2lQeQWhHGm-YALS8vMAFAA)

The following uses the TypeCompiler to perform JIT optimized type checking for TRPC.

```typescript
import { TSchema } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TRPCError } from '@trpc/server'

export function RpcType<T extends TSchema>(schema: T) {
  const check = TypeCompiler.Compile(schema)
  return (value: unknown) => {
    if (check.Check(value)) return value
    const { path, message } = check.Errors(value).First()!
    throw new TRPCError({ message: `${message} for ${path}`, code: 'BAD_REQUEST' })
  }
}
```

<a name="Value"></a>

### With [Value](https://www.typescriptlang.org/dev/bug-workbench/?target=99&lib=true&ts=4.7.4#code/PTAEAEDMEsBsFMB2BDAtvAXKATgBwMYAuAnrvAHSEDOAUNKrgPbaGgDeoAasrAK7ygAvqEjZGqUAHJwVaInyxk0bMBJkARowAewAG49+kug2asOAFQDK+ABbxUyISLETps+YuWrS8TVqP0TCzsoOYASgAKAMIAothi2E6i4lLghHj4wFTw2Lo5RjTwWkGskLzyhNCMiKBhBOY+ADzmoEWESAAmVKHWdg4AfAAUVLb2yFjmADQ48JA5SPjwVBO9YwDaALqgALygmwCU7DSgM4S82DWD+nyYoOUA1oiMAO6Ih9v9Rycn0JCD3DdyFE7Ph7sNRg5ptd+PtDth4GcLqBofBjt98NUqGZQLhkIQbNN0FQqMgAOYCYS7NbkGkA-jkOIJKjgvrIabwubw+RLKEGeD7DZrAAMGzRJ3xYmeoEQ8Cl4WijOYgw4RJJ5KwAAMACRsVVk+DCSDMUA63H4wQa6YYjq3SQAIQAggARAD6YRiAEUAKoxSzmSRCfZowQ0EM0EAQGAIFDoLBiXjtbCUWiBUwhOTQQjyqJJFypdIELI5PLYAImYIWHy5lJuOQKJQqNS+bRlkohOr4BpkauucjADJNgoYxBY0DIDodACSiFwCZ2tXqPkGXYoAHl1AAreBEZVo8ahHzkAByvFQ6hyg32kzR6gmh5PZ4vQcEsJoNGHo-HHVXCdnrF2HYrsu96nue2CXkG76Yqw-6gBmWaRFE5D4PCeLwJeb5FG2H6sMguC4GEjAJjk86EOQ8aJruJxflgZG4GIiwdOcqLfKA5ByH+gxftOf5Bqx5BEYQnFfj+QkJnx3zkAAjvw2DEIMypwTOc4vjsnwcQm5COAA1Epf7kOohwRk2AC0JJzKG+xAA)

The following performs dynamic type checking without code evaluation.

```typescript
import { Value } from '@sinclair/typebox/value'
import { TSchema } from '@sinclair/typebox'
import { TRPCError } from '@trpc/server'

export function RpcType<T extends TSchema>(schema: T) {
  return (value: unknown) => {
    if (Value.Check(schema, value)) return value
    const { path, message } = Value.Errors(schema, value).First()!
    throw new TRPCError({ message: `${message} for ${path}`, code: 'BAD_REQUEST' })
  }
}
```

<a name="Ajv"></a>

### With [Ajv](https://www.typescriptlang.org/dev/bug-workbench/?target=99&lib=true&ts=4.7.4#code/PTAEAEDMEsBsFMB2BDAtvAXKATgBwMYAuAnrvAHSEDOAUNKrgPbaGgDeoAKgMr4AW8VMgA0oboWSFo+UAF9QkbI1SgA5OCrRE+WMmjZgJMgCNGAD1V0GzVh04AlAAoBhAKLYl2OQqUr1hPHxgKnhsADdQy3omFlAAQQArMJ9lNWQk4AATaCpCYAAmAAYiyxp4MxjWSABXbSlGRFB7Ak5SeAAeTlBywiRMqi5eASEAPgAKKn5BZCxOUWx4SFCkfHgqWaHpgG0AXVAAXlBdgEp2GlBQfAbc0HTkw8R4AHd4pLHj85xF5e018khmK5kPwxmMFksFr9TvsRrckuRkJlMpshGDvpDVscPhcrogblN8ABrA5wsLkK4MODwCZTITYr6EarYRpjMLIWDVTCgWqExCMJ6IY5YcSSaSdWEws4XC7QSBjAmE1nszlYhlMxpsjnwT44662UDoKhUZAAc3goi0uWQv0ckj43kOCvIoU8VAAhFtCjsdaBCHwlC9Hi8HC53J4xhxDcazVgAAYAEjYUdN8HkAK8ictEhtdtksdEV0yXNUACE4gARAD69lcAEUAKqubicVRyemyGgdmggCAwBAodBYJTVXrYSi0aI2digLTQQgh5zeRSpfyBYKhCLYKLWWJ2NpL3xqDRaHR6AxGeCmCxWSrT5r4VpkA8r8jAQIX0q4m6IzIASUQuAjiS96PtSoHkAA8sYCTwEQEafDMXBtOQABy1SoMYoTvMInzGLMyFoRhWEfLIWI0DQX6sD+EEjoBrCHCBbRjOBhGYdg7wfBReq+iSs7zk4zjkgskjUpx5S3pRty4Lg9iMCOoQkoQ5DDqO8EXD+WBKbgSirJkTLatKoDkFodFjD+-50fSFzkHJhCmdRtEjlZRkAI6ctgxCghwJlAaRBywj5SnIKAADUM4ASO5DGKcPYXgAtMaSydscQA)

The following uses Ajv to perform more generalized JSON Schema checks across the complete JSON Schema specification.

```typescript
import { TSchema, Static } from '@sinclair/typebox'
import { TRPCError } from '@trpc/server'
import Ajv from 'ajv/dist/2020'

export function RpcType<T extends TSchema>(schema: T, references: TSchema[] = []) {
  const ajv = new Ajv()
  references.forEach((reference) => ajv.addSchema(reference))
  const check = ajv.compile(schema)
  return (value: unknown): Static<T> => {
    if (check(value)) return value
    const { message, instancePath } = check.errors![0]
    throw new TRPCError({ message: `${message} for ${instancePath}`, code: 'BAD_REQUEST' })
  }
}
```
