# Base

Base class for building extended types.

## Definition

The Base type is a class definition that includes methods which can be overridden. The primary methods to override are Check and Errors, which are called by TypeBox validators, and Clone, which is used by the TypeBox compositor to create new instances of Base when composing with other types.

> ⚠️ Important: The Clone method must be overridden; otherwise, a `Clone not implemented` exception may be thrown. This method is used by the type compositor to generate new instances during type composition. Clone is typically required when the Base type is used within computed types such as Partial, Required, Pick, or Omit.

By convention, Base type definitions start with a leading T and are paired with a factory function that creates instances of the type. The following example demonstrates how to define a DateType using Base, implementing the required Check, Errors, and Clone methods.

```typescript
export class TDateType extends Type.Base<Date> {
  // required: Used by validation
  public override Check(value: unknown): value is Date {
    return value instanceof Date
  }
  // required: Used by validation
  public override Errors(value: unknown): object[] {
    return !this.Check(value) ? [{ message: 'not a Date'}] : []
  }
  // required: Used by type compositor
  public override Clone(): TDateType {
    return new TDateType()
  }
}
// factory
export function DateType(): TDateType {
  return new TDateType()
}
```

## Usage

Once created, the type can be used with TypeBox validators.

```typescript
const R = Value.Check(DateType(), new Date())      // const R = true

const E = Value.Errors(DateType(), 'x')            // const E = [{
                                                   //   keyword: "~guard",
                                                   //   schemaPath: "#",
                                                   //   instancePath: "",
                                                   //   params: { 
                                                   //     errors: [ { message: "not a Date" } ] 
                                                   //   },
                                                   //   message: "must match check function"
                                                   // }]
```

## Guard

Use the IsBase function to guard values of this type.

```typescript
Type.IsBase(value)                                  // value is Base
```
