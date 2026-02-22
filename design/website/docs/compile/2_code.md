# Compile.Code

The Code function is used to create standalone ESM validation modules that can be written to disk and imported as regular JavaScript modules. This function is an alternative to Compile and provides a way to achieve high throughput validation in [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) restricted environments.

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