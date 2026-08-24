# Format.IsEmail

Returns true if the string is an email

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsEmail('user@example.com')
```

## Schema 

```typescript
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'email' }, 'user@example.com')
```