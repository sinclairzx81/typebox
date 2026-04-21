# Type.Refine

The Refine function applies explicit validation logic to a type. Unlike structural type checks, Refine allows you to express constraints that cannot be captured by JSON Schema alone, such as cross-property checks, mathematical properties, or domain-specific business rules.

## Example

The following creates a Refine type that validates a number is prime.

```typescript
import Type from 'typebox'

// ------------------------------------------------------------------
// IsPrime
// ------------------------------------------------------------------
const IsPrime = (value: number): boolean => {
  if (value <= 1) return false
  for (let i = 2; i <= Math.sqrt(value); i++)
    if (value % i === 0) return false
  return true
}
// ------------------------------------------------------------------
// Prime
// ------------------------------------------------------------------

type Prime = Type.Static<typeof Prime>      // type Prime = number
                                            //              |
                                            //              infer from TNumber

const Prime = Type.Refine(Type.Number(),    // const Prime = {
  value => IsPrime(value),                  //   type: "number",
  value => `Value ${value} is not Prime`)   //   "~refine": [{ 
                                            //     check: (value) => {...}, 
                                            //     error: (value) => {...}
                                            //   }]
                                            // }

const E = Value.Errors(Prime, 42)           // const E = [{
                                            //   keyword: "~refine",
                                            //   schemaPath: "#",
                                            //   instancePath: "",
                                            //   params: { index: 0, message: "Value 42 is not Prime" },
                                            //   message: "Value 42 is not Prime"
                                            // }]
```