import * as Types from '../typebox';
export declare namespace ValueCheck {
    function Check<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): boolean;
}
