# Base

The Base type is a base class for creating extended TypeBox schematics. 

## Definition

By convention, Base definitions begin with a leading `T` and should be accompanied by a factory function that creates instances the type. The following creates a DateType definition using Base. 

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
                                                   //   keyword: "~standard",
                                                   //   schemaPath: "#/~standard",
                                                   //   instancePath: "",
                                                   //   params: { 
                                                   //     vendor: "typebox", 
                                                   //     issues: [ { message: "not a Date" } ] 
                                                   //   },
                                                   //   message: "must match against typebox schema"
                                                   // }]
```

## Guard

Use the IsBase function to guard values of this type.

```typescript
Type.IsBase(value)                                  // value is Base
```
