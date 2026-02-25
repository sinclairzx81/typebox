# Compile.Acceleration

TypeBox achieves high performance by generating optimized JavaScript validation code derived from JSON schematics. This generated code is runtime evaluated within the environment, a technique known as JIT compile. This approach is safe, however some environments do block runtime code evaluation (such as `eval` or `new Function`). In these cases, acceleration will not be possible. One notable environment where evaluation is restricted is Cloudflare workers.

TypeBox implements internal fallbacks for these environments and will downgrade to interpretted dynamic checking using the Value.* submodule if it detects a restrictive [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP). 


## IsAccelerated

You can check if the validator is using interpretted fallbacks with the IsAccelerated function.

 ```typescript
import { Compile } from 'typebox/compile'

const C = Compile(Type.String())

console.log(C.IsAccelerated()) // true if accelerated
```

## Disable Acceleration

It is possible to disable acceleration irrespective of Content Security Policy.

```typescript
import System from 'typebox/system'

System.Settings.Set({ useAcceleration: false })

// ...

const C = Compile(Type.String())

console.log(C.IsAccelerated()) // will be false


```