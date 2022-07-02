import * as Types from '../typebox';
export interface TypeError {
    schema: Types.TSchema;
    path: string;
    value: unknown;
    message: string;
}
export declare namespace TypeErrors {
    function Errors<T extends Types.TSchema>(schema: T, additional: Types.TSchema[], value: any): Generator<TypeError>;
}
