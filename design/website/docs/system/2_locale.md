# System.Locale

TypeBox provides error message translation (i18n) support for over 40 languages. 

## Example

TypeBox uses ISO 639-1 language region codes for each Locale. They can be set in the following way.

```typescript
import System from 'typebox/system'

System.Locale.Set(Locale.en_US)                      // English - United States
System.Locale.Set(Locale.ko_KR)                      // Korean  - South Korea
System.Locate.Set(Locale.fr_FR)                      // French  - France
System.Locale.Set(Locale.zh_Hant)                    // Chinese - Traditional
```


## Errors

Set the Locale immediately before calling Errors to generate messages for that locale.

```typescript
import System from 'typebox/system'
import Schema from 'typebox/schema'
import Type from 'typebox'

System.Locale.Set(Locale.fr_FR)                      // French - France

const E = Schema.Errors(Type.Number(), 'not-number') // const E = [false, {
                                                     //   keyword: "type",
                                                     //   schemaPath: "#/type",      
                                                     //   instancePath: "",
                                                     //   params: { type: "number" },
                                                     //   message: "doit être number"   
                                                     // }]
```
