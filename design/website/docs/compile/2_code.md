# Code

The Code function is used to create standalone Esm validation modules that can be written to disk and imported as regular JavaScript modules. This function is an alternative to Compile and provides a way to achieve high throughput validation in [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) restricted environments.

## CodeResult

The Code function returns a CodeResult structure that contains two properties, Code and External.

```typescript
import { Code } from 'typebox/compile'

const result = Code(Type.String())

console.log(result.Code)                           // export function SetExternal(external) { ... }
                                                   // 
                                                   // export function Check(value) { ... }

console.log(result.External)                       // { identifier: '...', variables: [...] }
```

## Code

The Code property is plain JavaScript that can be written to disk.

## External

The External property is variables that cannot be serialized to JavaScript code. The External property is needed to support non-schema data structures, such as implementations of Standard Schema. The TypeBox compiler will detect these instances and return them as external variables that need to be explicitly injected into the module via the `SetExternal` function. 

```typescript
import { Code } from 'typebox/compile'

// ------------------------------------------------------------------
// Create Type
// ------------------------------------------------------------------

import * as z from 'npm:zod'

const T = Type.Object({
  x: z.number(),
  y: z.number()
})

// ------------------------------------------------------------------
// Generate Module
// ------------------------------------------------------------------

const esm = Code(T)

// ------------------------------------------------------------------
// Inspect Internal
// ------------------------------------------------------------------

console.log(esm.External)                           // {
                                                    //   variables: [
                                                    //      ZodNumber,
                                                    //      ZodNumber
                                                    //   ]
                                                    // }

// ------------------------------------------------------------------
// Write Module
// ------------------------------------------------------------------

Deno.writeTextFileSync('./t.ts', esm.Code)

// ------------------------------------------------------------------
// Import Module
// ------------------------------------------------------------------

import { Check, SetExternal } from './t.ts'

// ------------------------------------------------------------------
// Set External
// ------------------------------------------------------------------

SetExternal(esm.External)

// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------

const R = Check({ x: 1, y: 1 })                    // const R: boolean = true
```