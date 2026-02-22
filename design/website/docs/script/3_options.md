# Script.Options

Script types support options and constraints.

## Function

Script can accept options as the last argument.

```typescript
const Email = Type.Script('string', {               // const Email = {
  format: 'email'                                   //   type: 'string',
})                                                  //   format: 'email'
                                                    // }
```

## Embedded Types

Types embedded in Script can be assigned options with the `Assign<Type, Json>` generic type.

```typescript
const Vector = Type.Script(`{
  x: Options<number, { minimum: 0 }>,
  y: Options<number, { minimum: 0 }>,
  z: Options<number, { minimum: 0 }>
}`)                                                 // const Vector = {
                                                    //   type: 'object',
                                                    //   required: ['x', 'y', 'z'],
                                                    //   properties: {
                                                    //     x: { type: 'number', minimum: 0 },
                                                    //     y: { type: 'number', minimum: 0 },
                                                    //     z: { type: 'number', minimum: 0 }
                                                    //   }
                                                    // }               
```

## TypeScript

The `Assign<Type, Json>` can be represented in TypeScript in the following way. This lets you to create types with options in TypeScript, then copy them to Script.

```typescript
type Options<Type, _Json> = Type                    // Ignore Json

type Vector = {                                     // TypeScript | Copy to Script
  x: Options<number, { minimum: 0 }>,
  y: Options<number, { minimum: 0 }>,
  z: Options<number, { minimum: 0 }>
} 
```