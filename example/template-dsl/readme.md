# TemplateLiteral DSL

This example implements a small string based DSL for dynamically parsing strings into `TTemplateLiteral` types at runtime. The `template-dsl.ts` script provided with this example contains the full implementation. It can be copied and pasted into projects with TypeBox 0.28.0 or higher installed. 

The example is a candiate for possible inclusion in TypeBox under a `Type.TemplateLiteral(template_dsl_string)` overloaded type function.

## Example

The DSL supports a similar syntax to TypeScript template literal type syntax. The following shows general usage.

```typescript
import { Static } from '@sinclair/typebox'
import { TemplateLiteral } from './template-dsl'

// ----------------------------------------------------------------
// Path
// ----------------------------------------------------------------

const Path = TemplateLiteral('/users/${number}/posts/${string}')

type Path = Static<typeof Path> // type Path = '/users/${number}/posts/${string}'

// ----------------------------------------------------------------
// Bytes
// ----------------------------------------------------------------

const Byte = TemplateLiteral('${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}')

type Byte = Static<typeof Byte> // type Byte = '00000000' | '00000001' | '00000010' ... | '11111111' 
```

