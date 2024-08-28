### 0.33.0

- [Revision 0.33.7](https://github.com/sinclairzx81/typebox/pull/963) Additional updates to improve Default for enumerable objects.
- [Revision 0.33.6](https://github.com/sinclairzx81/typebox/pull/963) Add object traversal path for Default. Ensure enumerable objects are traversed.
- [Revision 0.33.5](https://github.com/sinclairzx81/typebox/pull/959) Provide better support for transforming properties with optional modifiers. 
- [Revision 0.33.4](https://github.com/sinclairzx81/typebox/pull/953) Add Assert and Parse value functions. Add defacto AssertError type.
- [Revision 0.33.3](https://github.com/sinclairzx81/typebox/pull/950) Optimize Value Diff algorithm. Update edit sequence to INSERT, UPDATE then DELETE.
- [Revision 0.33.2](https://github.com/sinclairzx81/typebox/pull/947) Ensure user defined schema options are retained on mapping types, Pick, Omit and Mapped.
- [Revision 0.33.1](https://github.com/sinclairzx81/typebox/pull/945) Apply mutability fix for Intrinsic and Not schematics (inline with Default)
- [Revision 0.33.0](https://github.com/sinclairzx81/typebox/pull/941) Add InstanceMode to enable Clone, Freeze and Default schema initialization options. Optimize for Default.

### 0.32.0

- [Revision 0.32.35](https://github.com/sinclairzx81/typebox/pull/914) Support Any for Record keys, Revert error message on required property, Fix order dependency for Union Convert.
- [Revision 0.32.34](https://github.com/sinclairzx81/typebox/pull/914) Fix template literal generation for template literals embedded within template literals.
- [Revision 0.32.33](https://github.com/sinclairzx81/typebox/pull/905) Pin ESM compiler target to ES2020. 
- [Revision 0.32.32](https://github.com/sinclairzx81/typebox/pull/898) Fix for Enum properties when used with Mapped types.
- [Revision 0.32.31](https://github.com/sinclairzx81/typebox/pull/881) Fix for Cast. Dereference Union variants before scoring.
- [Revision 0.32.30](https://github.com/sinclairzx81/typebox/pull/868) Support null object prototypes for Encode/Decode.
- [Revision 0.32.29](https://github.com/sinclairzx81/typebox/pull/862) Key derive optimization to improve Intersect Encode/Decode performance.
- [Revision 0.32.28](https://github.com/sinclairzx81/typebox/pull/861) Fix for TransformEncode introduced with 0.32.24, 0.32.25 optimizations.
- [Revision 0.32.27](https://github.com/sinclairzx81/typebox/pull/854) Support for esm.sh and general build tooling updates.
- [Revision 0.32.26](https://github.com/sinclairzx81/typebox/pull/851) Optimization for number checks, use Number.isFinite(x) over typeof `number`.
- [Revision 0.32.25](https://github.com/sinclairzx81/typebox/pull/849) Optimizations for type builder to improve schema creation performance for computed types.
- [Revision 0.32.24](https://github.com/sinclairzx81/typebox/pull/848) Optimizations for Convert to avoid unnecessary object initialization and cloning.
- [Revision 0.32.22](https://github.com/sinclairzx81/typebox/pull/840) Add Support for Optional and Readonly Function and Constructor Arguments.
- [Revision 0.32.21](https://github.com/sinclairzx81/typebox/pull/836) Refactor Array Conversion logic. Discard TNever on TComposite.
- [Revision 0.32.20](https://github.com/sinclairzx81/typebox/pull/810) Fix compiler regression (TS 5.3.3 -> 5.4.2) generating Diff declaration structures.
- [Revision 0.32.19](https://github.com/sinclairzx81/typebox/pull/805) Revert Union Convert logic added on 0.32.16.
- [Revision 0.32.18](https://github.com/sinclairzx81/typebox/pull/801) Add explicit return type on TypeSystem.Type.
- [Revision 0.32.17](https://github.com/sinclairzx81/typebox/pull/799) Detect ambiguous inference for StaticDecode when inferring as any.
- [Revision 0.32.16](https://github.com/sinclairzx81/typebox/pull/791) Enhance Composite, Mapped, Indexed and Transform types. Intersect and Union Convert updates, Include Path in Validation Error.
- [Revision 0.32.15](https://github.com/sinclairzx81/typebox/pull/774) Additional internal guards for Type Arrays, Map and Set structures.
- [Revision 0.32.14](https://github.com/sinclairzx81/typebox/pull/753) Use barrel exports for submodules.
- [Revision 0.32.13](https://github.com/sinclairzx81/typebox/pull/744) Add minLength and maxLength constraint for RegExp
- [Revision 0.32.12](https://github.com/sinclairzx81/typebox/pull/740) Fix option assignment on Record types.
- [Revision 0.32.11](https://github.com/sinclairzx81/typebox/pull/738) Optimize Extract, Exclude. Overloads for Template Literal
- [Revision 0.32.10](https://github.com/sinclairzx81/typebox/pull/734) Export additional type infrastructure for Partial and Required
- [Revision 0.32.9](https://github.com/sinclairzx81/typebox/pull/731) Generalize Composite to accept schematics of type TSchema[]
- [Revision 0.32.8](https://github.com/sinclairzx81/typebox/pull/728) Ensure schema `default` annotation is cloned on Create.
- [Revision 0.32.7](https://github.com/sinclairzx81/typebox/pull/727) Ensure schema `default` annotation is cloned on Default.
- [Revision 0.32.6](https://github.com/sinclairzx81/typebox/pull/724) Export additional type infrastructure for mapping types
- [Revision 0.32.5](https://github.com/sinclairzx81/typebox/pull/718) Update licence year span for 2024
- [Revision 0.32.4](https://github.com/sinclairzx81/typebox/pull/708) Ensure ErrorFunctionParameter type is exported
- [Revision 0.32.3](https://github.com/sinclairzx81/typebox/pull/703) Simplify Record Static Type
- [Revision 0.32.1](https://github.com/sinclairzx81/typebox/pull/701) Specify default exports for Web Pack






















































