# Base

Base class for building extended types.

## Definition

The Base type is a class definition that includes methods which can be overridden. The two primary methods to override are Check and Errors, both of which are invoked by TypeBox validators. By convention, Base type definitions begin with a leading `T` and are paired with a factory function that creates instances of the type. The following example demonstrates how to define a DateType using Base. 

```typescript
export class TDateType extends Type.Base<Date> {
  public override Check(value: unknown): value is Date {
    return value instanceof Date
  }
  public override Errors(value: unknown): object[] {
    return !this.Check(value) ? [{ message: 'not a Date'}] : []
  }
}

export function DateType(): TDateType {
  return new TDateType()
}
```

## Usage

Once created, the type can be used with TypeBox validators.

```typescript
const R = Value.Check(DateType(), new Date())      // const R = true

const E = Value.Errors(DateType(), 'x')            // const E = [{
                                                   //   keyword: "~base",
                                                   //   schemaPath: "#",
                                                   //   instancePath: "",
                                                   //   params: { 
                                                   //     errors: [ { message: "not a Date" } ] 
                                                   //   },
                                                   //   message: "must match against typebox schema"
                                                   // }]
```

## Guard

Use the IsBase function to guard values of this type.

```typescript
Type.IsBase(value)                                  // value is Base
```
