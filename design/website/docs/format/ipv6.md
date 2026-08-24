# Format.IsIPv6

Returns true if the string is an IPv6 address

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
```

## Schema

Test with format keyword

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'ipv6' }, '2001:0db8:85a3:0000:0000:8a2e:0370:7334')
```