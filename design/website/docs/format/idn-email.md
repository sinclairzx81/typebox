# Format.IsIdnEmail

Returns true if the string is an internationalized email address described by [RFC 4952](https://datatracker.ietf.org/doc/html/rfc4952) and supported by the SMTP extension in [RFC 6531](https://datatracker.ietf.org/doc/html/rfc6531).

## Maximum Length

Inputs longer than 65,536 UTF-16 code units return false. Use JSON Schema's `maxLength` keyword to set a lower limit.

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