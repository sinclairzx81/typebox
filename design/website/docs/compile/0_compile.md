# Compile.Compile

The Compile function returns a new Validator instance.

## Example

The following creates a Validator with Compile.

```typescript
import { Compile } from 'typebox/compile'

const C = Compile(Type.Object({                        // const C: Validator<{}, TObject<{
  x: Type.Number(),                                    //   x: TNumber,
  y: Type.Number(),                                    //   y: TNumber,
  z: Type.Number()                                     //   z: TNumber
}))                                                    // }>>
```

The following creates a Validator via constructor.

```typescript
import { Validator } from 'typebox/compile'

const C = new Validator({}, Type.Object({              // const C: Validator<{}, TObject<{
  x: Type.Number(),                                    //   x: TNumber,
  y: Type.Number(),                                    //   y: TNumber,
  z: Type.Number()                                     //   z: TNumber
}))                                                    // }>>
```