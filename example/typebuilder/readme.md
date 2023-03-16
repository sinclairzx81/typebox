# TypeBuilder

How to extend the TypeBox type builder with custom types.

## Overview

The TypeBox TypeBuilder is designed to be extended with user defined types. Instances where you may wish to do this are if your application is dependent on custom schematics and/o non-JSON values that cannot be reasonably implemented in TypeBox (an example of which might be a Mongo `ObjectId` or other such specialized type)

## Application Type Builder

The following shows creating a custom `ApplicationTypeBuilder` with additional types `Nullable` and `StringEnum` types.

```typescript
import { TypeBuilder, Static, TSchema } from '@sinclair/typebox'

export class ApplicationTypeBuilder extends TypeBuilder {
  public Nullable<T extends TSchema>(schema: T) {
    return this.Unsafe<Static<T> | null>({ ...schema, nullable: true })
  }
  public StringEnum<T extends string[]>(values: [...T]) {
    return this.Unsafe<T[number]>({ type: 'string', enum: values })
  }
}

export const Type = new ApplicationTypeBuilder()    // re-export!
```
Which can be used as follows
```typescript
import { Type } from './application-type-builder'

const T = Type.StringEnum(['A', 'B', 'C'])

type T = Static<typeof T>                            // type T = 'A' | 'B' | 'C'
```

## Experimental Type Builder

This `experimental.ts` file provided with this example shows advanced usage by creating custom mapped types for potential inclusion in the TypeBox library. It is offered for reference, experimentation and is open to contributor submission.