# TypeMap

TypeMap is a fluent type builder abstraction built on top of TypeBox. It is modelled after the Yup and Zod and libraries, but internally uses TypeBox for type composition, inference and runtime type assertion. It supports the same advanced compositional types as TypeBox (including generics, conditional, recursive and template literal types), but offers this functionality as a set of chainable lowercase types. 

Like TypeBox, TypeMap internally uses JSON schema for its type representation. It provides access to the TypeBox compiler infrastructure with the `.compile()` and `.code()` methods which are available on all types, and access to the internal schema via `.schema()`. Types also implement `.check()` and `.cast()` for convenience. 

TypeMap is implemented as an example for reference purposes only.