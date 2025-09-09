# Locale

TypeBox provides error message translation (i18n) support for over 40 languages. 

## Example

TypeBox uses ISO 639-1 language region codes for each Locale. They can be set in the following way.

```typescript
import { Locale } from 'typebox/system'

Locale.Set(Locale.en_US)                           // English - United States

Locale.Set(Locale.ko_KR)                           // Korean - South Korea

Locate.Set(Locale.fr_FR)                           // French - France

Locale.Set(Locale.zh_Hant)                         // Chinese - Traditional
```


## Errors

Set the Locale immediately before calling Errors to generate messages for that locale.

```typescript
Locale.Set(Locale.fr_FR)                            // French - France

const E = Value.Errors(Type.Number(), '???')        // const E = [{
                                                    //   keyword: "type",
                                                    //   schemaPath: "#/type",      
                                                    //   instancePath: "",
                                                    //   params: { type: "number" },
                                                    //   message: "doit être number"   
                                                    // }]
```
