# Type.String

Creates a String type.

## Example

Example usage is shown below.

```typescript
const T = Type.String()                             // const T = {
                                                    //   type: 'string'
                                                    // }

type T = Static<typeof T>                           // type T = string
```

## Guard

Use the IsString function to guard values of this type.

```typescript
Type.IsString(value)                                // value is TString

```

## Options

The following options are available for String

```typescript
export interface TStringOptions extends TSchemaOptions {
  /** 
   * A string format such as 'email', 'uuid' or other registered format.
   */
  format?: TFormat
  /** 
   * Specifies the minimum number of characters allowed in the string.  
   * Must be a non-negative integer.
   */
  minLength?: number
  /** 
   * Specifies the maximum number of characters allowed in the string.  
   * Must be a non-negative integer.
   */
  maxLength?: number
  /** 
   * Specifies a regular expression pattern that the string value must match.  
   * Can be provided as a string (ECMA-262 regex syntax) or a `RegExp` object.
   */
  pattern?: string | RegExp
}
```