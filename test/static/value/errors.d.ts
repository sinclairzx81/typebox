import * as Types from '../typebox';
export interface ValueError {
    schema: Types.TSchema;
    path: string;
    value: unknown;
    message: string;
}
export declare namespace ValueErrors {
    function Errors<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): IterableIterator<ValueError>;
}
