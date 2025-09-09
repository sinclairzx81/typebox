# Format

Functions to Validate String Formats

## Overview

The Format module contains functions to validate various string formats referenced in the [Defined Formats 7.3](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.7.3) section of Json Schema specification. 

The Format module is provided via optional import.

```typescript
import Format from 'typebox/format'
```

## Example

The following validates an email address.

```typescript
const isEmail = Format.IsEmail('user@domain.com')
```