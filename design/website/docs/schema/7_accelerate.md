# Schema.Accelerate

TypeBox attains high performance by compiling JSON schematics into optimized JavaScript validation routines. These routines are evaluated at runtime within the environment; a technique known as Just-In-Time (JIT) compilation.

TypeBox takes measures to ensure evaluation is safe, however some environments do restrict runtime code evaluation by preventing calls to `eval()` or `new Function()`. In such cases, acceleration will not be possible. TypeBox will automatically fall back to interpreted dynamic checking if it detects a restrictive [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).


## IsAccelerated

You can check if a compiled Validator is using accleration with the IsAccelerated function.

 ```typescript
import { Compile } from 'typebox/schema'

const C = Compile(Type.String())

console.log(C.IsAccelerated()) // true if accelerated
```

## Disable Acceleration

You can disable all acceleration with the following system setting.

```typescript
import System from 'typebox/system'

System.Settings.Set({ useAcceleration: false })   // default is true

// ...

const C = Schema.Compile(Type.String())

console.log(C.IsAccelerated())                    // will be false


```