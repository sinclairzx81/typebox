# Format.IsHostname

Returns true if the string is an internationalized [RFC 5890](https://datatracker.ietf.org/doc/html/rfc5890) hostname

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsHostname('예제.회사')
```

## Schema

Test with format keyword

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'idn-hostname' }, '예제.회사')
```