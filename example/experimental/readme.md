# ExperimentalTypeBuilder

An experimental TypeBox type builder with additional custom types.

## Overview

The TypeBox TypeBuilder classes are designed to be extended with user defined types. Instances where you may wish to do this are if your application is dependent on custom schematics and/or non-JSON serializable values (an example of which might be a Mongo's `ObjectId` or other such non-serializable value)

## Application Type Builder

The following shows creating a simple `ApplicationTypeBuilder` with additional types `Nullable` and `StringEnum`. These types are fairly common in OpenAPI implementations.

```typescript
import { StandardTypeBuilder, Static, TSchema } from '@sinclair/typebox'

export class ApplicationTypeBuilder extends StandardTypeBuilder { // only JSON Schema types
  public Nullable<T extends TSchema>(schema: T) {
    return this.Unsafe<Static<T> | null>({ ...schema, nullable: true })
  }
  public StringEnum<T extends string[]>(values: [...T]) {
    return this.Unsafe<T[number]>({ type: 'string', enum: values })
  }
}

export const Type = new ApplicationTypeBuilder()    // re-export!
```

## Experimental Type Builder

The `experimental.ts` file provided with this example shows advanced usage by creating complex types for potential inclusion in the TypeBox library in later revisions. It is offered for reference, experimentation and is open to contributor submission.