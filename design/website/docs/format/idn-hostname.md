# Format.IsIdnHostname

Returns true if the string is an internationalized hostname described by [RFC 5890](https://datatracker.ietf.org/doc/html/rfc5890), [RFC 5891](https://datatracker.ietf.org/doc/html/rfc5891), [RFC 5892](https://datatracker.ietf.org/doc/html/rfc5892), and [RFC 5893](https://datatracker.ietf.org/doc/html/rfc5893).

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsIdnHostname('예제.회사')
```

## Schema

Test with format keyword

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'idn-hostname' }, '예제.회사')
```