import * as Types from '../typebox';
export declare namespace ValueCreate {
    /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
    function Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[]): Types.Static<T>;
    function Create<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R]): Types.Static<T>;
}
