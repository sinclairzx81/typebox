import * as Types from '../typebox';
export declare namespace Value {
    /** Returns true if the value conforms to the given schema */
    function Check<T extends Types.TSchema>(schema: T, value: any): value is Types.Static<T>;
    /** Returns a deep clone of the given value */
    function Clone<T>(value: T): T;
    /** Creates a value from the given schema type */
    function Create<T extends Types.TSchema>(schema: T): Types.Static<T>;
    /** Upcasts a value to match a schema while preserving as much information from the original value as possible. */
    function Upcast<T extends Types.TSchema>(schema: T, value: any): Types.Static<T>;
}
