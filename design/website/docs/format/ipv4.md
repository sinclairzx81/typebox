# Format.IsIPv4

Returns true if the string is an IPv4 address

## Function

Test with format function

```typescript
import Format from 'typebox/format'

const R = Format.IsIPv4('192.168.0.1')
```

## Schema

Test with format keyword

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'ipv4' }, '192.168.0.1')
```