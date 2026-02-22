# Value.Parse

The Parse function validates and returns a value that conforms to a given type. If the value does not satisfy the type, a parse error is thrown.

## Example

Example usage is shown below.

```typescript
const R = Value.Parse(Type.String(), 'hello')      // const R: string = "hello"

const E = Value.Parse(Type.String(), 12345)        // throws ParseError 
```

## Corrective Parse

TypeBox provides an optional corrective parsing mode that attempts to repair invalid values before failing. When enabled, the parser runs a pipeline consisting of Convert, Default, and Clean, then re-asserts the value after processing. This feature can be useful when parsing environment variables into target types.

> ⚠️ This feature can impact performance. It is not recommended for use in high throughput applications.

This feature can be enabled as follows:

```typescript
import { Settings } from 'typebox/system'

// Corrective Parse: Enable

Settings.Set({ correctiveParse: true })

// Corrective Parse: Convert Value into the target type if reasonable conversion is possible.

const R = Value.Parse(Type.String(), 'hello')      // const R: string = "hello"

const S = Value.Parse(Type.String(), 12345)        // const S: string = "12345"

// Corrective Parse: Reset (optional)

Settings.Reset()
```