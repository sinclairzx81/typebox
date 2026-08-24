# Format.IsIriReference

Returns true if the string is an IRI reference

## Function

```typescript
import Format from 'typebox/format'

const R = Format.IsIriReference('https://예제.회사/경로')
```

## Schema

```typescript 
import Schema from 'typebox/schema'

const R = Schema.Check({ format: 'iri-reference' }, 'https://예제.회사/경로')
```