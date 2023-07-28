# Using TypeBox with TRPC

To use TypeBox with TRPC, you will need to wrap types in a TRPC compatible validation function. The following shows wrapping a type using the TypeCompiler.

<a name="Example"></a>

## Example

[TypeScript Link Here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzsAdsGAVASgBQMIA0c2+AolFNHAL5wBmlIcA5AAIxRgDGA9AM4BTKADchzALAAoUJFiJiATzAC8EcMAA2QmvUYtWfVFw0BDYFB4wlAgEYQAHjy5qwmsVJnR4SDNaIYAZS4ACwEQEx0GNX1DFGMzCytlO3sJSSkeHjgAWly8-ILCouKS0rLyvIys1XUtPjgI32UGlAATOCgBGABXKBR6iOMIPl6BeioSPCqcitm5+YWCqQF7WXg6briYYAgUOCxuJoEAHgw4FZgBNvrAkLCTAD4ACj478IAuYiJOuiErrgEfE+t1C4QA2gBdOAAXjgkIAlIgpHA4M5+vA7lwANYwxTKGquLRQAB0BLcLzeJm+Al+nTigPhyI6XV6eyewhMGm6Ak+myxKAgAHcUIjoQ8kZIUSjgHQ4E9MVjSaFsezOdz4YjOj0+nAOVyBEyUWi+N44GATDBgkQQIC+CYAOZjWiwhXE8iUKB8VX6+HEgBi5hNT3hAEJDXBLZRBXAUAJo5N3dAnkgbXw7Y7PgADAAkCFT6YEtDoVFz5st1EzRGcrR5LAAQgBBAAiAH0sKQAIoAVVIAQwzBojMlNCk1Gmiwnk6nlUkmTgXYL4+ny5XZSkxvg8FhqHQk2JXE6FoEwfXuxNDVa7VhMGJYEoANaoyZxNQYG6MCeBy4Rye4aOxIAeRsAArAQuA-BBwxRExgWsYkADluhAGwhGDAgoLgGxYOUBCkJQqA0PDaghxRDVnwgd83w-L8fz-ODEOQ1CSNI5jiQAR25KAFCeZNkBQKjBxhcVX3fYkIgAaj4qjiRsRE5ySARsjtX4pGWVYvFRM94BMMAwCwCjLigXEb0od9UKQJkTEvOBR3hIA)

```typescript
import { initTRPC, TRPCError } from '@trpc/server'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Type, TSchema } from '@sinclair/typebox'

// ---------------------------------------------------------------------------------
// Compiles a Type and returns a closure for TRPC
// ---------------------------------------------------------------------------------
export function RpcType<T extends TSchema>(schema: T, references: TSchema[] = []) {
  const check = TypeCompiler.Compile(schema, references)
  return (value: unknown) => {
    if (check.Check(value)) return value
    const { path, message } = check.Errors(value).First()!
    throw new TRPCError({ message: `${message} for ${path}`, code: 'BAD_REQUEST' })
  }
}
// ---------------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------------
const t = initTRPC.create()
const add = t.procedure
  .input(RpcType(
    Type.Object({
      a: Type.Number(),
      b: Type.Number(),
    })
  ))
  .output(RpcType(
    Type.Number()
   ))
  .query(({ input }) => input.a + input.b) // type-safe

export const appRouter = t.router({ 
  add 
})
```