import * as Types from '../typebox';
/** Values from TypeBox Types */
export declare namespace Value {
    /** Creates a value from the given schema and associated referenced schemas */
    function Create<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R]): Types.Static<T>;
    /** Creates a value from the given schema */
    function Create<T extends Types.TSchema>(schema: T): Types.Static<T>;
    /** Checks if the given value matches the given schema with associated references */
    function Check<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): value is Types.Static<T>;
    /** Checks if the given value matches the given schema */
    function Check<T extends Types.TSchema>(schema: T, value: any): value is Types.Static<T>;
    /** Casts the given value to match the given schema and associated references. The result will be a value that retains as much information from the original value as possible. */
    function Cast<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): value is Types.Static<T>;
    /** Casts the given value to match the given schema. The result will be a value that retains as much information from the original value as possible. */
    function Cast<T extends Types.TSchema>(schema: T, value: any): value is Types.Static<T>;
}
