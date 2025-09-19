# Settings

The Settings namespace manages type system configurations.

## Example

The following makes compositor properties enumerable.

```typescript
import { Settings } from 'typebox/system'

Settings.Set({ enumerableKind: true })              // Debug types         

console.log(Type.String())                          // const T = { '~kind': 'String', type: 'string' }
                                                    //              ^
                                                    //              enumerable
```

The following settings are available.

```typescript
export interface TSettings {
  /**
   * Determines whether types should be instantiated as immutable using `Object.freeze(...)`.
   * This helps prevent unintended schema mutation. Enabling this option introduces a slight
   * performance overhead during instantiation.
   * @default false
   */
  immutableTypes: boolean

  /**
   * Specifies the maximum number of errors to buffer during diagnostics collection. TypeBox
   * performs exhaustive checks to gather diagnostics for invalid values, which can result in
   * excessive buffering for large or complex types. This setting limits the number of buffered
   * errors and acts as a safeguard against potential denial-of-service (DoS) attacks.
   * @default 8
   */
  maxErrors: number

  /**
   * Enables or disables the use of runtime code evaluation to accelerate validation. By default,
   * TypeBox checks for `unsafe-eval` support in the environment before attempting to evaluate
   * generated code. If evaluation is not permitted, it falls back to dynamic checking. Setting
   * this to `false` disables evaluation entirely, which may be desirable in applications that
   * restrict runtime code evaluation, regardless of Content Security Policy (CSP).
   * @default true
   */
  useEval: boolean

  /**
   * Enables or disables 'exactOptionalPropertyTypes' check semantics. By default, TypeScript 
   * allows optional properties to be assigned 'undefined'. While this behavior differs from the 
   * common interpretation of 'optional' as meaning 'key may be absent', TypeBox adopts the default 
   * TypeScript semantics to remain consistent with the language. This option is provided to align 
   * runtime check semantics with projects that configure 'exactOptionalPropertyTypes: true' in 
   * tsconfig.json.
   * @default false
   */
  exactOptionalPropertyTypes: boolean

  /**
   * Controls whether internal compositor properties (`~kind`, `~readonly`, `~optional`) are enumerable.
   * @default false
   */
  enumerableKind: boolean
}
```