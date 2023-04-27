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

Unlike Zod, Yup, Superstruct, TypeBox types are pure JSON Schema and do not implement a built in `parse()` or `validate()` function. Because of this, you will need to wrap the Type in a TRPC compatible function which implements `parse()` on behalf of TRPC. As JSON Schema is a formal specification, there are a number of ways you may choose to implement this function. The following are some recommended implementations.

<a name="TypeCompiler"></a>

### With [TypeCompiler](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQJ5gKYGELmAGwyjgF84AzKXOAcgAEBnYAOwGN8BDYKAehnQwAjCAA8erXGAJEaAWABQoSLEQoAyqwAWGEB1JwDhytXpM2nbnwHCRcxeGjwkyAEoAFLAFEoVYmSNUILR0MFBgrDwMRABuMgoKGCLK8OQArmwwwBDMcC7haJgAPMhwiTAYzAAmDOpaOhwAfAAUDHW6AFwoADRwUBjkRBWsGAydyBraugDaALpwALxwswCUiAoGEswM8HWsANYLKAI4eIRQAHQnUoQtbRw9fQN9bCPL670YMKlQOU3RHPhUhhOuk9swIAB3ZireYNNbyQxwYDkOBNXZ7S7afZ-AFA5arPpfH5wf6AjDvDbZbaqMAcGCaHogEYMDgAcww+kW6PO3l8DBxZOW5wAYtxtk1lgBCClwelUCFwZgYBWuDy86BNJBMhgs9mdAAGABIENrdRgyORoHBjbT6SR9T0JJVgbQAEIAQQAIgB9FyeACKAFVPGpkDRSG8EaQFCQgA)

The following uses the TypeCompiler to perform JIT optimized type checking for TRPC.

```typescript
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { TSchema } from '@sinclair/typebox'
import { TRPCError } from '@trpc/server'

export function RpcType<T extends TSchema>(schema: T, references: TSchema[] = []) {
  const check = TypeCompiler.Compile(schema, references)
  return (value: unknown) => {
    if (check.Check(value)) return value
    const { path, message } = check.Errors(value).First()!
    throw new TRPCError({ message: `${message} for ${path}`, code: 'BAD_REQUEST' })
  }
}
```

<a name="Value"></a>

### With [Value](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgNQIYBsCuBTOBfOQwgMyghDgHIABAZ2ADsBjdVYKAehgE8xsAjCAA8OANww5KAWABQoSLERwAKgGUmAC2whU+IqXJU6jFm048+godLnho8JMoBKABQDCAUShkoegxRoYKDAmDlpsKFEIm1lsIQV4YkxmGGAIBjgnEOVebAAeZTg4mGwGABNaFXUtHQA+AApaTW1UAC4VABo4KGxiCNKmbFp2tWadAG0AXTgAXjgpgEpEWUIemEwoDPrxLGx25IBrBggAdwYlmdrlmSI4YGI4erRdgDo3LSYDxrHULp6+nrMIZdHY4BZLNYbDKg7ArIhMdK0BxwMCoGAaLogIa0VAAc1wBDmzxwLy8Plo3xqvzgMIWLwAYuwkfUFgBCOGEdFkE5wBjYHnOdxk6D1JBY2g4-HtAAGABIEOLJdgCMRoHB5aj0XhpV0EWU9lQAEIAQQAIgB9JweACKAFUPKplJR8As4XhZHggA)

The following uses dynamic type checking without code evaluation. This is slower to validate, but may be required in restricted code evaluation environments.

```typescript
import { Value } from '@sinclair/typebox/value'
import { TSchema } from '@sinclair/typebox'
import { TRPCError } from '@trpc/server'

export function RpcType<T extends TSchema>(schema: T, references: TSchema[] = []) {
  return (value: unknown) => {
    if (Value.Check(schema, references, value)) return value
    const { path, message } = Value.Errors(schema, value).First()!
    throw new TRPCError({ message: `${message} for ${path}`, code: 'BAD_REQUEST' })
  }
}
```

<a name="Ajv"></a>

### With [Ajv](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQMoGMAWBTEBDAGjlRjxmHTgF84AzKCEOAcgAEBnYAO3QBs9gUAPQwAnmGwAjCAA9mAWABQoSLEQoASgAUAwgFEoDKNTimzdBkzYwoYdEPbYoANycLl4aPACCAK2cWjCx4-kIAJsDsMEIATAAM8e5K2DKq8LQArjzkEFxwGnbI4tgAPMhwKTDYXGHsKBg4+AB8ABTsWLh4AFwoRFDYtE7V6NjsPWgd+ADaALpwALxwswCUiEqm6LlRcCEBi1zYAO5wfs4ty+tw-YP9PKMAdLTQenhYLS3XQ3er8007-vc8GEwg1Oh8Bl8RssLooNlt4B10ABrBb-Zz3TbgYC8bBtSZ4GGmfowDJQPItZx4XgZbA9LJIrgQQ5cZY9EhkChlP6-NawszAWhwFqIpEUqk06FXbAkslwSnU7CXOFcbZIECjdh4ADm2CI3CieDuWjImBMixF9ycRnYAEIpnEZkq4DBMAxjgdjshtPpDNAWmqNdraXAAAYAEgQ6vYmp1NCexgj+tIRpNVBDRE2YWDzAAQt4ACIAfQ0egAigBVPSoZDMaiE6hKKhAA)

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
