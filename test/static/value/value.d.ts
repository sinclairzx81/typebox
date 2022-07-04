import * as Types from '../typebox';
import { ValueError } from './errors';
/** Creates Values from TypeBox Types */
export declare namespace Value {
    /** Creates a value from the given type */
    function Create<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R]): Types.Static<T>;
    /** Creates a value from the given type */
    function Create<T extends Types.TSchema>(schema: T): Types.Static<T>;
    /** Checks a value matches the given type */
    function Check<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): value is Types.Static<T>;
    /** Checks a value matches the given type */
    function Check<T extends Types.TSchema>(schema: T, value: unknown): value is Types.Static<T>;
    /** Casts a value into a structure matching the given type. The result will be a new value that retains as much information of the original value as possible. */
    function Cast<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): Types.Static<T>;
    /** Casts a value into a structure matching the given type. The result will be a new value that retains as much information of the original value as possible. */
    function Cast<T extends Types.TSchema>(schema: T, value: unknown): Types.Static<T>;
    /** Returns an iterator for each error in this value. */
    function Errors<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: unknown): IterableIterator<ValueError>;
    /** Returns an iterator for each error in this value. */
    function Errors<T extends Types.TSchema>(schema: T, value: unknown): IterableIterator<ValueError>;
}
