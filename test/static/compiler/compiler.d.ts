import * as Types from '../typebox';
export declare type CheckFunction = (value: unknown) => boolean;
export declare class TypeCheckAssertError extends Error {
    readonly schema: Types.TSchema;
    readonly value: unknown;
    constructor(schema: Types.TSchema, value: unknown);
}
export declare class TypeCheck<T extends Types.TSchema> {
    private readonly schema;
    private readonly checkFunc;
    private readonly code;
    constructor(schema: T, checkFunc: CheckFunction, code: string);
    /** Returns the compiled validation code used to check this type. */
    Code(): string;
    /** Returns true if the value is valid. */
    Check(value: unknown): value is Types.Static<T>;
    /** Asserts the given value and throws a TypeCheckAssertError if invalid. */
    Assert(value: unknown): void;
}
export declare namespace TypeCompiler {
    /** Compiles the given type for runtime type checking. This compiler only accepts known TypeBox types non-inclusive of unsafe types. */
    function Compile<T extends Types.TSchema>(schema: T, additional?: Types.TSchema[]): TypeCheck<T>;
}
