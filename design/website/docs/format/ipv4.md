# Format.IsIPv4

Returns true if the string is an IPv4 address

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsIPv4('192.168.0.1')
```

## Schema

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'ipv4' }, '192.168.0.1')
```