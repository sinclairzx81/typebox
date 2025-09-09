# Evaluate

TypeBox attains high performance by generating optimized JavaScript code at runtime using schema introspection. This approach is safe, but some environments block runtime code execution (such as `eval` or `new Function`). In these cases, high-performance validation is not possible. One notable environment that does this is Cloudflare workers.

TypeBox implements internal fallbacks for these environments and will downgrade to dynamic checking using the Value.* submodule if it detects a restrictive [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP). 


## Example

You can check if the compiler is using Value.* fallbacks with the IsEvaluated function.

 ```typescript
import { Compile } from 'typebox/compile'

const C = Compile(Type.String())

console.log(C.IsEvaluated())                      // The IsEvaluated function will return false if
                                                   // the environment does not support runtime code
                                                   // evaluation.
```