# Format.IsIdnEmail

Returns true if the string is an internationalized [RFC 6531](https://datatracker.ietf.org/doc/html/rfc6531) email address

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsIdnEmail('사용자@예제.회사')
```

## Schema

Test with format keyword

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'idn-email' }, '사용자@예제.회사')
```